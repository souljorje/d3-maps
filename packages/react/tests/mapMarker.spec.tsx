import { describe, expect, it, vi } from 'vitest'

import {
  fireEvent,
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

  it('throws without map context', () => {
    expect(() => render(
      <svg>
        <MapMarker
          data-testid="fallback-map-marker"
          coordinates={[10, 10]}
        />
      </svg>,
    )).toThrowError('useMapContext must be used inside Map')
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

  it('allows overriding the outer group name', () => {
    render(
      <MapBase data={sampleGeoJson}>
        <MapMarker
          data-testid="map-marker"
          coordinates={[10, 10]}
          name="annotation"
        />
      </MapBase>,
    )

    expect(screen.getByTestId('map-marker').getAttribute('name')).toBe('annotation')
  })

  it('forwards focus and blur callbacks', () => {
    const onFocus = vi.fn()
    const onBlur = vi.fn()

    render(
      <MapBase data={sampleGeoJson}>
        <MapMarker
          data-testid="map-marker-focus"
          coordinates={[10, 10]}
          tabIndex={0}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </MapBase>,
    )

    const marker = screen.getByTestId('map-marker-focus')
    fireEvent.focus(marker)
    fireEvent.blur(marker)

    expect(onFocus).toHaveBeenCalledTimes(1)
    expect(onBlur).toHaveBeenCalledTimes(1)
  })
})
