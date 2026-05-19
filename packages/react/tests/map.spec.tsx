import {
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
  MapObjects,
  useCreateMapContext,
} from '../src'
import {
  sampleGeoJson,
  sampleGeoJsonTwoFeatures,
  sampleTopologyObjectKey,
  sampleTopologyTwoObjects,
} from './fixtures'

describe('map', () => {
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

  it('updates rendered objects when map data prop changes', () => {
    const { container, rerender } = render(
      <MapBase data={sampleGeoJson}>
        <MapObjects />
      </MapBase>,
    )

    expect(container.querySelectorAll('path')).toHaveLength(1)

    rerender(
      <MapBase data={sampleGeoJsonTwoFeatures}>
        <MapObjects />
      </MapBase>,
    )

    expect(container.querySelectorAll('path')).toHaveLength(2)
  })

  it('updates rendered objects when topology data and objectKey change', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    try {
      const { container, rerender } = render(
        <MapBase data={sampleGeoJson}>
          <MapObjects />
        </MapBase>,
      )

      expect(container.querySelectorAll('path')).toHaveLength(1)

      rerender(
        <MapBase
          data={sampleTopologyTwoObjects}
          objectKey={sampleTopologyObjectKey}
        >
          <MapObjects />
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
        <MapObjects
          data={sampleTopologyTwoObjects}
          objectKey={sampleTopologyObjectKey}
        />
      </MapBase>,
    )

    expect(container.querySelectorAll('path')).toHaveLength(2)
  })

  it('renders with an external context object shared with sibling UI', () => {
    function Toolbar({ context }: { context: NonNullable<ReturnType<typeof useCreateMapContext>> }) {
      return <div data-testid="toolbar-count">{context.objects.length}</div>
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
            <MapObjects />
          </MapBase>
        </>
      )
    }

    const { container } = render(<Harness />)

    expect(screen.getByTestId('toolbar-count').textContent).toBe('1')
    expect(screen.getByTestId('map-svg').getAttribute('viewBox')).toBe('0 0 420 210')
    expect(container.querySelectorAll('path')).toHaveLength(1)
  })
})
