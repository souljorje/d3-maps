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
  it('allows overriding stroke and fill', () => {
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
