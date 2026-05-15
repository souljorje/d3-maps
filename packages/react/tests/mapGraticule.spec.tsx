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
      <MapBase data={sampleGeoJson}>
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
      <MapBase data={sampleGeoJson}>
        <MapGraticule data-testid="map-graticule-lines" />
      </MapBase>,
    )

    expect(container.querySelectorAll('path')).toHaveLength(1)
  })

  it('applies map-object interaction styles and callbacks on lines path', () => {
    const onMouseUp = vi.fn()

    render(
      <MapBase data={sampleGeoJson}>
        <MapGraticule
          data-testid="map-graticule-lines"
          styles={{
            default: { opacity: 0.9 },
            hover: { opacity: 0.7 },
            active: { opacity: 0.5 },
          }}
          onMouseUp={onMouseUp}
        />
      </MapBase>,
    )

    const lines = screen.getByTestId('map-graticule-lines')
    expect(lines.style.opacity).toBe('0.9')

    fireEvent.mouseEnter(lines)
    expect(lines.style.opacity).toBe('0.7')

    fireEvent.mouseDown(lines)
    expect(lines.style.opacity).toBe('0.5')

    fireEvent.mouseUp(lines)
    expect(lines.style.opacity).toBe('0.7')
    expect(onMouseUp).toHaveBeenCalledTimes(1)
  })

  it('forwards focus and blur callbacks on the lines path', () => {
    const onFocus = vi.fn()
    const onBlur = vi.fn()

    render(
      <MapBase data={sampleGeoJson}>
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
