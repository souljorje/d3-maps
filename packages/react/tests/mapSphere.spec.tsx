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

    const background = container.querySelector('[data-d3m="sphere-background"]')
    const border = container.querySelector('[data-d3m="sphere-border"]')

    expect(background?.getAttribute('fill')).toBe('#f8fafc')
    expect(background?.getAttribute('stroke')).toBe('none')
    expect(border?.getAttribute('fill')).toBe('none')
    expect(border?.getAttribute('stroke')).toBe('#cbd5e1')
  })

  it('wraps children between background and border paths', () => {
    const { container } = render(
      <MapBase fit={sampleGeoJson}>
        <MapSphere fill="#f8fafc" stroke="#cbd5e1">
          <MapGraticule data-testid="map-graticule-lines" />
        </MapSphere>
      </MapBase>,
    )

    const sphere = container.querySelector('[data-d3m="sphere"]')
    const children = Array.from(sphere?.children ?? [])
      .map((child) => child.getAttribute('data-d3m'))
      .filter(Boolean)
    const content = container.querySelector('[data-d3m="sphere-content"]')
    const clipPath = container.querySelector('clipPath')

    expect(children).toEqual([
      'sphere-background',
      'sphere-content',
      'sphere-border',
    ])
    expect(content?.getAttribute('clip-path')).toBe(`url(#${clipPath?.id})`)
    expect(content?.querySelector('[data-d3m="graticule"]')).toBeTruthy()
  })

  it('allows disabling child clipping', () => {
    const { container } = render(
      <MapBase fit={sampleGeoJson}>
        <MapSphere noClip>
          <MapGraticule />
        </MapSphere>
      </MapBase>,
    )

    const content = container.querySelector('[data-d3m="sphere-content"]')

    expect(container.querySelector('clipPath')).toBeNull()
    expect(content?.hasAttribute('clip-path')).toBe(false)
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
