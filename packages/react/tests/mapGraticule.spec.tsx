import { describe, expect, it, vi } from 'vitest'

import {
  fireEvent,
  render,
  screen,
} from '@testing-library/react'

import {
  MapBase,
  MapGraticule,
} from '../src'
import { sampleGeoJson } from './fixtures'

describe('mapGraticule', () => {
  it('renders graticule lines inside map context', () => {
    render(
      <MapBase fit={sampleGeoJson}>
        <MapGraticule
          data-testid="map-graticule-lines"
          stroke="#334155"
        />
      </MapBase>,
    )

    const lines = screen.getByTestId('map-graticule-lines')
    expect(lines.getAttribute('d')).toBeTruthy()
    expect(lines.getAttribute('fill')).toBe('none')
    expect(lines.getAttribute('stroke')).toBe('#334155')
  })

  it('renders only graticule lines', () => {
    const { container } = render(
      <MapBase fit={sampleGeoJson}>
        <MapGraticule data-testid="map-graticule-lines" />
      </MapBase>,
    )

    expect(container.querySelectorAll('path')).toHaveLength(1)
  })

  it('forwards native mouse callbacks on lines path', () => {
    const onMouseUp = vi.fn()

    render(
      <MapBase fit={sampleGeoJson}>
        <MapGraticule
          data-testid="map-graticule-lines"
          onMouseUp={onMouseUp}
        />
      </MapBase>,
    )

    const lines = screen.getByTestId('map-graticule-lines')
    fireEvent.mouseUp(lines)
    expect(onMouseUp).toHaveBeenCalledTimes(1)
  })

  it('forwards focus and blur callbacks on the lines path', () => {
    const onFocus = vi.fn()
    const onBlur = vi.fn()

    render(
      <MapBase fit={sampleGeoJson}>
        <MapGraticule
          data-testid="map-graticule-focus"
          tabIndex={0}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </MapBase>,
    )

    const lines = screen.getByTestId('map-graticule-focus')
    fireEvent.focus(lines)
    fireEvent.blur(lines)

    expect(onFocus).toHaveBeenCalledTimes(1)
    expect(onBlur).toHaveBeenCalledTimes(1)
  })

  it('throws without map context', () => {
    expect(() => render(
      <svg>
        <MapGraticule />
      </svg>,
    )).toThrowError('useMapContext must be used inside Map')
  })
})
