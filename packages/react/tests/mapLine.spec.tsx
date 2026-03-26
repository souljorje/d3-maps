import { describe, expect, it } from 'vitest'

import {
  render,
  screen,
} from '@testing-library/react'

import {
  MapBase,
  MapLine,
} from '../src'
import { sampleGeoJson } from './fixtures'

const LINE_COORDINATES: [number, number][] = [
  [-122.4194, 37.7749],
  [-73.935242, 40.73061],
]
const THREE_POINT_COORDINATES: [number, number][] = [
  [-122.4194, 37.7749],
  [-98.5795, 39.8283],
  [-73.935242, 40.73061],
]
function midpointCurve(context: {
  moveTo: (x: number, y: number) => void
  lineTo: (x: number, y: number) => void
}) {
  let pointIndex = 0

  return {
    lineStart() {
      pointIndex = 0
    },
    lineEnd() {},
    point(x: number, y: number) {
      if (pointIndex === 0) {
        context.moveTo(x, y)
      } else {
        context.lineTo(x, y + 1)
      }

      pointIndex += 1
    },
  }
}

describe('mapLine', () => {
  it('renders projected line path inside map context', () => {
    render(
      <MapBase data={sampleGeoJson}>
        <MapLine
          data-testid="map-line"
          coordinates={LINE_COORDINATES}
          stroke="#ff6f26"
        />
      </MapBase>,
    )

    const line = screen.getByTestId('map-line')
    expect(line.getAttribute('d')).toMatch(/^M/)
  })

  it('uses default fill value', () => {
    render(
      <MapBase data={sampleGeoJson}>
        <MapLine
          data-testid="map-line-fill"
          coordinates={LINE_COORDINATES}
        />
      </MapBase>,
    )

    expect(screen.getByTestId('map-line-fill').getAttribute('fill')).toBe('none')
  })

  it('throws without map context', () => {
    expect(() => render(
      <svg>
        <MapLine
          data-testid="map-line-fallback"
          coordinates={LINE_COORDINATES}
        />
      </svg>,
    )).toThrowError('useMapContext must be used inside Map')
  })

  it('renders cartesian paths inside map context', () => {
    render(
      <MapBase data={sampleGeoJson}>
        <MapLine
          data-testid="map-line-cartesian"
          coordinates={[
            [0, 0],
            [40, 0],
          ]}
          cartesian
        />
      </MapBase>,
    )

    expect(screen.getByTestId('map-line-cartesian').getAttribute('d')).toBe('M0,0L40,0')
  })

  it('recomputes line path when map context changes', () => {
    const { rerender } = render(
      <MapBase
        data={sampleGeoJson}
        width={300}
      >
        <MapLine
          data-testid="map-line-recomputed"
          coordinates={LINE_COORDINATES}
        />
      </MapBase>,
    )

    const initialPath = screen.getByTestId('map-line-recomputed').getAttribute('d')

    rerender(
      <MapBase
        data={sampleGeoJson}
        width={700}
      >
        <MapLine
          data-testid="map-line-recomputed"
          coordinates={LINE_COORDINATES}
        />
      </MapBase>,
    )

    const nextPath = screen.getByTestId('map-line-recomputed').getAttribute('d')
    expect(nextPath).not.toBe(initialPath)
  })

  it('renders a path for multi-point coordinates', () => {
    render(
      <MapBase data={sampleGeoJson}>
        <MapLine
          data-testid="map-line-multi-point"
          coordinates={THREE_POINT_COORDINATES}
        />
      </MapBase>,
    )

    expect(screen.getByTestId('map-line-multi-point').getAttribute('d')).toMatch(/^M/)
  })

  it('supports custom projected paths', () => {
    render(
      <MapBase data={sampleGeoJson}>
        <MapLine
          data-testid="map-line-custom"
          coordinates={THREE_POINT_COORDINATES}
          custom
        />
      </MapBase>,
    )

    expect(screen.getByTestId('map-line-custom').getAttribute('d')).toMatch(/^M/)
  })

  it('uses the provided D3 curve for custom paths', () => {
    const { rerender } = render(
      <MapBase data={sampleGeoJson}>
        <MapLine
          data-testid="map-line-curved"
          coordinates={THREE_POINT_COORDINATES}
          custom
        />
      </MapBase>,
    )

    const linearPath = screen.getByTestId('map-line-curved').getAttribute('d')

    rerender(
      <MapBase data={sampleGeoJson}>
        <MapLine
          data-testid="map-line-curved"
          coordinates={THREE_POINT_COORDINATES}
          custom
          curve={midpointCurve}
        />
      </MapBase>,
    )

    expect(screen.getByTestId('map-line-curved').getAttribute('d')).not.toBe(linearPath)
  })

  it('uses curveNatural by default for custom paths', () => {
    const { rerender } = render(
      <MapBase data={sampleGeoJson}>
        <MapLine
          data-testid="map-line-curved"
          coordinates={THREE_POINT_COORDINATES}
          custom
        />
      </MapBase>,
    )

    const linearPath = screen.getByTestId('map-line-curved').getAttribute('d')

    rerender(
      <MapBase data={sampleGeoJson}>
        <MapLine
          data-testid="map-line-curved"
          coordinates={THREE_POINT_COORDINATES}
          custom
        />
      </MapBase>,
    )

    expect(screen.getByTestId('map-line-curved').getAttribute('d')).toBe(linearPath)
  })

  it('applies midpoint shaping for curved connector paths', () => {
    const { rerender } = render(
      <MapBase data={sampleGeoJson}>
        <MapLine
          data-testid="map-line-midpoint"
          coordinates={[
            [0, 0],
            [40, 0],
          ]}
          cartesian
        />
      </MapBase>,
    )

    const basePath = screen.getByTestId('map-line-midpoint').getAttribute('d')

    rerender(
      <MapBase data={sampleGeoJson}>
        <MapLine
          data-testid="map-line-midpoint"
          coordinates={[
            [0, 0],
            [40, 0],
          ]}
          cartesian
          midpoint={[0, -40]}
        />
      </MapBase>,
    )

    expect(screen.getByTestId('map-line-midpoint').getAttribute('d')).not.toBe(basePath)
  })
})
