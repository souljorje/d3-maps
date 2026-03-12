import { describe, expect, it } from 'vitest'

import type { MapLineCurve } from '@d3-maps/core'

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
const offsetCurve: Exclude<MapLineCurve, boolean> = (context) => {
  let isFirstPoint = true

  return {
    lineStart() {
      isFirstPoint = true
    },
    lineEnd() {},
    point(x, y) {
      if (isFirstPoint) {
        context.moveTo(x, y)
        isFirstPoint = false

        return
      }

      context.lineTo(x, y + 12)
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

  it('renders a different path when curve mode is enabled', () => {
    render(
      <Map data={sampleGeoJson}>
        <MapLine
          data-testid="map-line-straight"
          coordinates={LINE_COORDINATES}
        />
        <MapLine
          data-testid="map-line-curved"
          coordinates={LINE_COORDINATES}
          curve
        />
      </Map>,
    )

    const straightPath = screen.getByTestId('map-line-straight').getAttribute('d')
    const curvedPath = screen.getByTestId('map-line-curved').getAttribute('d')
    expect(curvedPath).not.toBe(straightPath)
  })

  it('accepts a d3 curve factory for projected line shaping', () => {
    render(
      <Map data={sampleGeoJson}>
        <MapLine
          data-testid="map-line-linear"
          coordinates={THREE_POINT_COORDINATES}
        />
        <MapLine
          data-testid="map-line-basis"
          coordinates={THREE_POINT_COORDINATES}
          curve={offsetCurve}
        />
      </Map>,
    )

    const linearPath = screen.getByTestId('map-line-linear').getAttribute('d')
    const basisPath = screen.getByTestId('map-line-basis').getAttribute('d')
    expect(basisPath).not.toBe(linearPath)
  })
})
