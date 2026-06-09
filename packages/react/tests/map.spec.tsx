import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import {
  render,
  screen,
} from '@testing-library/react'

import {
  MapBase,
  MapFeatures,
  useCreateMapContext,
} from '../src'
import {
  sampleGeoJson,
  sampleGeoJsonTwoFeatures,
  sampleTopologyObjectKey,
  sampleTopologyTwoObjects,
} from './fixtures'

const makeMapContextSpy = vi.hoisted(() => vi.fn())

vi.mock('@d3-maps/core', async () => {
  const actual = await vi.importActual<typeof import('@d3-maps/core')>('@d3-maps/core')

  return {
    ...actual,
    makeMapContext: (...args: Parameters<typeof actual.makeMapContext>) => {
      makeMapContextSpy(...args)
      return actual.makeMapContext(...args)
    },
  }
})

describe('map', () => {
  beforeEach(() => {
    makeMapContextSpy.mockClear()
  })

  it('renders default viewBox from map defaults', () => {
    render(
      <MapBase
        data-testid="map-svg"
      />,
    )

    expect(screen.getByTestId('map-svg').getAttribute('viewBox')).toBe('0 0 600 300')
  })

  it('creates context from map defaults', () => {
    function Harness() {
      const context = useCreateMapContext()

      return <div data-testid="map-context-size">{`${context.width}x${context.height}`}</div>
    }

    render(<Harness />)

    expect(screen.getByTestId('map-context-size').textContent).toBe('600x300')
  })

  it('renders render-prop children with map context', () => {
    render(
      <MapBase
        width={420}
        data-testid="map-svg"
      >
        {(context) => (
          <g
            data-testid="map-size-group"
            data-size={`${context.width}x${context.height}`}
          />
        )}
      </MapBase>,
    )

    expect(screen.getByTestId('map-size-group').getAttribute('data-size')).toBe('420x210')
  })

  it('updates projection when map padding changes', () => {
    const renderScale = (padding: number) => (
      <MapBase padding={padding}>
        {(context) => (
          <g
            data-testid="map-projection"
            data-scale={context.projection.scale()}
          />
        )}
      </MapBase>
    )

    const { rerender } = render(renderScale(1))
    const initialScale = Number(screen.getByTestId('map-projection').getAttribute('data-scale'))

    rerender(renderScale(20))

    expect(Number(screen.getByTestId('map-projection').getAttribute('data-scale'))).toBeLessThan(initialScale)
  })

  it('updates rendered objects when map data prop changes', () => {
    const { container, rerender } = render(
      <MapBase fit={sampleGeoJson}>
        <MapFeatures data={sampleGeoJson} />
      </MapBase>,
    )

    expect(container.querySelectorAll('path')).toHaveLength(1)

    rerender(
      <MapBase fit={sampleGeoJsonTwoFeatures}>
        <MapFeatures data={sampleGeoJsonTwoFeatures} />
      </MapBase>,
    )

    expect(container.querySelectorAll('path')).toHaveLength(2)
  })

  it('updates rendered objects when topology data and objectKey change', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    try {
      const { container, rerender } = render(
        <MapBase fit={sampleGeoJson}>
          <MapFeatures data={sampleGeoJson} />
        </MapBase>,
      )

      expect(container.querySelectorAll('path')).toHaveLength(1)

      rerender(
        <MapBase
          fit={sampleTopologyTwoObjects}
          fitObjectKey={sampleTopologyObjectKey}
        >
          <MapFeatures
            data={sampleTopologyTwoObjects}
            objectKey={sampleTopologyObjectKey}
          />
        </MapBase>,
      )

      expect(container.querySelectorAll('path')).toHaveLength(2)
      expect(consoleError).not.toHaveBeenCalled()
    } finally {
      consoleError.mockRestore()
    }
  })

  it('creates context without shared data for layer-local manual maps', () => {
    const { container } = render(
      <MapBase
        fit="manual"
        projectionConfig={{
          scale: 160,
          translate: [[450, 250]],
        }}
      >
        <MapFeatures
          data={sampleTopologyTwoObjects}
          objectKey={sampleTopologyObjectKey}
        />
      </MapBase>,
    )

    expect(container.querySelectorAll('path')).toHaveLength(2)
  })

  it('renders with an external context object shared with sibling UI', () => {
    function Toolbar({ context }: { context: ReturnType<typeof useCreateMapContext> }) {
      return <div data-testid="toolbar-width">{context.width}</div>
    }

    function Harness() {
      const context = useCreateMapContext({
        fit: sampleGeoJson,
        width: 420,
      })

      return (
        <>
          <Toolbar context={context} />
          <MapBase
            context={context}
            data-testid="map-svg"
          >
            <MapFeatures data={sampleGeoJson} />
          </MapBase>
        </>
      )
    }

    const { container } = render(<Harness />)

    expect(screen.getByTestId('toolbar-width').textContent).toBe('420')
    expect(screen.getByTestId('map-svg').getAttribute('viewBox')).toBe('0 0 420 210')
    expect(container.querySelectorAll('path')).toHaveLength(1)
  })

  it('does not recreate map context on parent rerender with stable props', () => {
    function Harness({ tick }: { tick: number }) {
      return (
        <div data-tick={String(tick)}>
          <MapBase
            fit={sampleGeoJson}
            width={420}
          >
            <MapFeatures data={sampleGeoJson} />
          </MapBase>
        </div>
      )
    }

    const { rerender } = render(<Harness tick={0} />)

    expect(makeMapContextSpy).toHaveBeenCalledTimes(1)

    rerender(<Harness tick={1} />)

    expect(makeMapContextSpy).toHaveBeenCalledTimes(1)
  })
})
