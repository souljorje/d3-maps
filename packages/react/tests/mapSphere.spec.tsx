import { describe, expect, it } from 'vitest'

import { render } from '@testing-library/react'

import {
  MapBase,
  MapFeatures,
  MapGraticule,
  MapSphere,
  MapZoom,
} from '../src'
import { sampleGeoJson } from './fixtures'

describe('mapSphere', () => {
  it('renders a single sphere path by default', () => {
    const { container } = render(
      <MapBase fit={sampleGeoJson}>
        <MapSphere />
      </MapBase>,
    )

    const [sphere] = Array.from(container.querySelectorAll('path'))

    expect(sphere?.getAttribute('fill')).toBe('none')
    expect(sphere?.getAttribute('stroke')).toBe('currentColor')
    expect(sphere?.getAttribute('pointer-events')).toBe('none')
    expect(sphere?.getAttribute('data-d3m')).toBe('sphere')
    expect(container.querySelectorAll('path')).toHaveLength(1)
  })

  it('renders a custom fill on the same sphere path', () => {
    const { container } = render(
      <MapBase fit={sampleGeoJson}>
        <MapSphere fill="#fef3c7" />
      </MapBase>,
    )

    const [sphere] = Array.from(container.querySelectorAll('path'))

    expect(sphere?.getAttribute('fill')).toBe('#fef3c7')
    expect(sphere?.getAttribute('stroke')).toBe('currentColor')
    expect(container.querySelectorAll('path')).toHaveLength(1)
  })

  it('allows overriding stroke on the same sphere path', () => {
    const { container } = render(
      <MapBase fit={sampleGeoJson}>
        <MapSphere fill="#f8fafc" stroke="#cbd5e1" />
      </MapBase>,
    )

    const [sphere] = Array.from(container.querySelectorAll('path'))

    expect(sphere?.getAttribute('fill')).toBe('#f8fafc')
    expect(sphere?.getAttribute('stroke')).toBe('#cbd5e1')
  })

  it('allows users to keep sphere outside zoomed content', () => {
    const { container } = render(
      <MapBase fit={sampleGeoJson}>
        <MapSphere />
        <MapZoom>
          <MapGraticule data-testid="map-graticule-lines" />
          <MapFeatures data={sampleGeoJson} />
        </MapZoom>
      </MapBase>,
    )

    const zoomGroup = container.querySelector('[data-d3m="zoom"]')
    const sphere = container.querySelector('[data-d3m="sphere"]')
    const graticule = container.querySelector('[data-d3m="graticule"]')

    expect(sphere?.parentElement).not.toBe(zoomGroup)
    expect(graticule?.parentElement).toBe(zoomGroup)
  })

  it('throws without map context', () => {
    expect(() => render(
      <svg>
        <MapSphere />
      </svg>,
    )).toThrow('useMapContext must be used inside MapBase')
  })
})
