import { describe, expect, it, vi } from 'vitest'

import {
  fireEvent,
  render,
  screen,
} from '@testing-library/react'

import {
  Map,
  MapGraticule,
} from '../src'
import { sampleGeoJson } from './fixtures'

describe('mapGraticule', () => {
  it('renders graticule lines inside map context', () => {
    render(
      <Map data={sampleGeoJson}>
        <MapGraticule
          data-testid="map-graticule-lines"
          stroke="#334155"
        />
      </Map>,
    )

    const lines = screen.getByTestId('map-graticule-lines')
    expect(lines.getAttribute('d')).toBeTruthy()
    expect(lines.getAttribute('fill')).toBe('none')
    expect(lines.getAttribute('stroke')).toBe('#334155')
  })

  it('does not render outline path when background and border are absent', () => {
    const { container } = render(
      <Map data={sampleGeoJson}>
        <MapGraticule data-testid="map-graticule-lines" />
      </Map>,
    )

    expect(container.querySelectorAll('path')).toHaveLength(1)
  })

  it('renders outline path when only background is provided', () => {
    const { container } = render(
      <Map data={sampleGeoJson}>
        <MapGraticule
          data-testid="map-graticule-lines"
          background="#fef3c7"
        />
      </Map>,
    )

    const [outlineFill, lines] = Array.from(container.querySelectorAll('path'))

    expect(outlineFill?.getAttribute('fill')).toBe('#fef3c7')
    expect(outlineFill?.getAttribute('stroke')).toBeNull()
    expect(outlineFill?.getAttribute('pointer-events')).toBe('none')
    expect(lines?.getAttribute('data-testid')).toBe('map-graticule-lines')
    expect(container.querySelectorAll('path')).toHaveLength(2)
  })

  it('renders background outline without inline color when background is true', () => {
    const { container } = render(
      <Map data={sampleGeoJson}>
        <MapGraticule
          data-testid="map-graticule-lines"
          background
        />
      </Map>,
    )

    const [outlineFill, lines] = Array.from(container.querySelectorAll('path'))

    expect(outlineFill?.getAttribute('fill')).toBeNull()
    expect(lines?.getAttribute('data-testid')).toBe('map-graticule-lines')
    expect(container.querySelectorAll('path')).toHaveLength(2)
  })

  it('renders outline path when only border is provided', () => {
    const { container } = render(
      <Map data={sampleGeoJson}>
        <MapGraticule
          data-testid="map-graticule-lines"
          border="#1e293b"
        />
      </Map>,
    )

    const [lines, outlineStroke] = Array.from(container.querySelectorAll('path'))

    expect(lines?.getAttribute('data-testid')).toBe('map-graticule-lines')
    expect(outlineStroke?.getAttribute('fill')).toBe('none')
    expect(outlineStroke?.getAttribute('stroke')).toBe('#1e293b')
    expect(container.querySelectorAll('path')).toHaveLength(2)
  })

  it('renders border outline without inline color when border is true', () => {
    const { container } = render(
      <Map data={sampleGeoJson}>
        <MapGraticule
          data-testid="map-graticule-lines"
          border
        />
      </Map>,
    )

    const [lines, outlineStroke] = Array.from(container.querySelectorAll('path'))

    expect(lines?.getAttribute('data-testid')).toBe('map-graticule-lines')
    expect(outlineStroke?.getAttribute('stroke')).toBeNull()
    expect(container.querySelectorAll('path')).toHaveLength(2)
  })

  it('renders fill-outline under lines and border-outline above lines', () => {
    const { container } = render(
      <Map data={sampleGeoJson}>
        <MapGraticule
          data-testid="map-graticule-lines"
          background="#f8fafc"
          border="#475569"
        />
      </Map>,
    )

    const [outlineFill, lines, outlineStroke] = Array.from(container.querySelectorAll('path'))

    expect(outlineFill?.getAttribute('fill')).toBe('#f8fafc')
    expect(lines?.getAttribute('data-testid')).toBe('map-graticule-lines')
    expect(outlineStroke?.getAttribute('fill')).toBe('none')
    expect(outlineStroke?.getAttribute('stroke')).toBe('#475569')
  })

  it('applies map-object interaction styles and callbacks on lines path', () => {
    const onMouseUp = vi.fn()

    render(
      <Map data={sampleGeoJson}>
        <MapGraticule
          data-testid="map-graticule-lines"
          styles={{
            default: { opacity: 0.9 },
            hover: { opacity: 0.7 },
            active: { opacity: 0.5 },
          }}
          onMouseUp={onMouseUp}
        />
      </Map>,
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

  it('renders graticule path outside map context without geometry', () => {
    const { container } = render(
      <svg>
        <MapGraticule />
      </svg>,
    )

    const paths = container.querySelectorAll('path')
    expect(paths).toHaveLength(1)
    expect(paths[0]?.getAttribute('d')).toBeNull()
  })
})
