import { describe, expect, it } from 'vitest'

import {
  render,
  screen,
} from '@testing-library/react'

import {
  Map,
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
function offsetCurve(context: {
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
      <Map data={sampleGeoJson}>
        <MapLine
          data-testid="map-line"
          coordinates={LINE_COORDINATES}
          stroke="#ff6f26"
        />
      </Map>,
    )

    const line = screen.getByTestId('map-line')
    expect(line.getAttribute('d')).toMatch(/^M/)
  })

  it('uses default fill value', () => {
    render(
      <Map data={sampleGeoJson}>
        <MapLine
          data-testid="map-line-fill"
          coordinates={LINE_COORDINATES}
        />
      </Map>,
    )

    expect(screen.getByTestId('map-line-fill').getAttribute('fill')).toBe('none')
  })

  it('has no path without map context', () => {
    render(
      <svg>
        <MapLine
          data-testid="map-line-fallback"
          coordinates={LINE_COORDINATES}
        />
      </svg>,
    )

    expect(screen.getByTestId('map-line-fallback').getAttribute('d')).toBeNull()
  })

  it('recomputes line path when map context changes', () => {
    const { rerender } = render(
      <Map
        data={sampleGeoJson}
        width={300}
      >
        <MapLine
          data-testid="map-line-recomputed"
          coordinates={LINE_COORDINATES}
        />
      </Map>,
    )

    const initialPath = screen.getByTestId('map-line-recomputed').getAttribute('d')

    rerender(
      <Map
        data={sampleGeoJson}
        width={700}
      >
        <MapLine
          data-testid="map-line-recomputed"
          coordinates={LINE_COORDINATES}
        />
      </Map>,
    )

    const nextPath = screen.getByTestId('map-line-recomputed').getAttribute('d')
    expect(nextPath).not.toBe(initialPath)
  })

  it('renders a path for multi-point coordinates', () => {
    render(
      <Map data={sampleGeoJson}>
        <MapLine
          data-testid="map-line-multi-point"
          coordinates={THREE_POINT_COORDINATES}
        />
      </Map>,
    )

    expect(screen.getByTestId('map-line-multi-point').getAttribute('d')).toMatch(/^M/)
  })

  it('supports custom projected paths', () => {
    render(
      <Map data={sampleGeoJson}>
        <MapLine
          data-testid="map-line-custom"
          coordinates={THREE_POINT_COORDINATES}
          custom
        />
      </Map>,
    )

    expect(screen.getByTestId('map-line-custom').getAttribute('d')).toMatch(/^M/)
  })

  it('uses the provided D3 curve for custom paths', () => {
    const { rerender } = render(
      <Map data={sampleGeoJson}>
        <MapLine
          data-testid="map-line-curved"
          coordinates={THREE_POINT_COORDINATES}
          custom
        />
      </Map>,
    )

    const linearPath = screen.getByTestId('map-line-curved').getAttribute('d')

    rerender(
      <Map data={sampleGeoJson}>
        <MapLine
          data-testid="map-line-curved"
          coordinates={THREE_POINT_COORDINATES}
          custom
          curve={offsetCurve}
        />
      </Map>,
    )

    expect(screen.getByTestId('map-line-curved').getAttribute('d')).not.toBe(linearPath)
  })
})
