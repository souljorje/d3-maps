import { describe, expect, it } from 'vitest'

import {
  render,
  screen,
} from '@testing-library/react'

import {
  MapBase,
  MapMarker,
} from '../src'
import { sampleGeoJson } from './fixtures'

describe('mapMarker', () => {
  it('uses projection transform from context', () => {
    render(
      <MapBase
        data={sampleGeoJson}
        width={400}
        height={300}
      >
        <MapMarker
          data-testid="map-marker"
          coordinates={[10, 10]}
        />
      </MapBase>,
    )

    expect(screen.getByTestId('map-marker').getAttribute('transform')).toMatch(/^translate\(/)
  })

  it('uses fallback transform without map context', () => {
    render(
      <svg>
        <MapMarker
          data-testid="fallback-map-marker"
          coordinates={[10, 10]}
        />
      </svg>,
    )

    expect(screen.getByTestId('fallback-map-marker').getAttribute('transform')).toBe('translate(0, 0)')
  })

  it('recomputes marker transform when map context changes', () => {
    const { rerender } = render(
      <MapBase
        data={sampleGeoJson}
        width={300}
      >
        <MapMarker
          data-testid="map-marker-recomputed"
          coordinates={[5, 5]}
        />
      </MapBase>,
    )

    const initialTransform = screen.getByTestId('map-marker-recomputed').getAttribute('transform')

    rerender(
      <MapBase
        data={sampleGeoJson}
        width={700}
      >
        <MapMarker
          data-testid="map-marker-recomputed"
          coordinates={[5, 5]}
        />
      </MapBase>,
    )

    const nextTransform = screen.getByTestId('map-marker-recomputed').getAttribute('transform')
    expect(nextTransform).not.toBe(initialTransform)
  })
})
