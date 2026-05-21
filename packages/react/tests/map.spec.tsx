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
  MapFeatures,
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
        data-testid="map-svg"
      />,
    )

    expect(screen.getByTestId('map-svg').getAttribute('viewBox')).toBe('0 0 600 300')
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
    function Toolbar({ context }: { context: NonNullable<ReturnType<typeof useCreateMapContext>> }) {
      return <div data-testid="toolbar-width">{context.width}</div>
    }

    function Harness() {
      const context = useCreateMapContext({
        fit: sampleGeoJson,
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
})
