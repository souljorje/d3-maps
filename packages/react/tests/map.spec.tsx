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
        data={sampleGeoJson}
        data-testid="map-svg"
      />,
    )

    expect(screen.getByTestId('map-svg').getAttribute('viewBox')).toBe('0 0 600 300')
  })

  it('renders render-prop children with map context', () => {
    render(
      <MapBase
        data={sampleGeoJson}
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

  it('updates rendered features when map data prop changes', () => {
    const { container, rerender } = render(
      <MapBase data={sampleGeoJson}>
        <MapFeatures />
      </MapBase>,
    )

    expect(container.querySelectorAll('path')).toHaveLength(1)

    rerender(
      <MapBase data={sampleGeoJsonTwoFeatures}>
        <MapFeatures />
      </MapBase>,
    )

    expect(container.querySelectorAll('path')).toHaveLength(2)
  })

  it('updates rendered features when topologyObjectKey changes', () => {
    const { container, rerender } = render(
      <MapBase data={sampleTopologyTwoObjects}>
        <MapFeatures />
      </MapBase>,
    )

    expect(container.querySelectorAll('path')).toHaveLength(1)

    rerender(
      <MapBase
        data={sampleTopologyTwoObjects}
        topologyObjectKey="pair"
      >
        <MapFeatures />
      </MapBase>,
    )

    expect(container.querySelectorAll('path')).toHaveLength(2)
  })

  it('renders with an external context object shared with sibling UI', () => {
    function Toolbar({ context }: { context: NonNullable<ReturnType<typeof useCreateMapContext>> }) {
      return <div data-testid="toolbar-count">{context.features.length}</div>
    }

    function Harness() {
      const context = useCreateMapContext({
        data: sampleGeoJson,
        width: 420,
      })

      if (!context) return null

      return (
        <>
          <Toolbar context={context} />
          <MapBase
            context={context}
            data-testid="map-svg"
          >
            <MapFeatures />
          </MapBase>
        </>
      )
    }

    const { container } = render(<Harness />)

    expect(screen.getByTestId('toolbar-count').textContent).toBe('1')
    expect(screen.getByTestId('map-svg').getAttribute('viewBox')).toBe('0 0 420 210')
    expect(container.querySelectorAll('path')).toHaveLength(1)
  })

  it('does not recreate map context on parent rerender with stable props', () => {
    const stableTransformer = (features: typeof sampleGeoJson.features) => features

    function Harness({ tick }: { tick: number }) {
      return (
        <div data-tick={String(tick)}>
          <MapBase
            data={sampleGeoJson}
            width={420}
            dataTransformer={stableTransformer}
          >
            <MapFeatures />
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
