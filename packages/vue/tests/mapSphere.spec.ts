import { describe, expect, it } from 'vitest'

import { mount } from '@vue/test-utils'
import { h } from 'vue'

import {
  MapBase,
  MapFeatures,
  MapGraticule,
  MapSphere,
  MapZoom,
} from '../src'
import { sampleGeoJson } from './fixtures'

function mountWithMapSphere(props: Record<string, unknown> = {}) {
  return mount(MapBase, {
    props: {
      fit: sampleGeoJson,
    },
    slots: {
      default: () => h(MapSphere, props),
    },
  })
}

describe('mapSphere', () => {
  it('renders a single sphere path by default', () => {
    const wrapper = mountWithMapSphere()
    const [sphere] = wrapper.findAll('path')

    expect(sphere.attributes('fill')).toBe('none')
    expect(sphere.attributes('stroke')).toBe('currentColor')
    expect(sphere.attributes('pointer-events')).toBe('none')
    expect(sphere.attributes('name')).toBe('sphere')
    expect(wrapper.findAll('path')).toHaveLength(1)
  })

  it('renders a custom fill on the same sphere path', () => {
    const wrapper = mountWithMapSphere({
      fill: '#fef3c7',
    })

    const [sphere] = wrapper.findAll('path')

    expect(sphere.attributes('fill')).toBe('#fef3c7')
    expect(sphere.attributes('stroke')).toBe('currentColor')
    expect(wrapper.findAll('path')).toHaveLength(1)
  })

  it('allows overriding stroke on the same sphere path', () => {
    const wrapper = mountWithMapSphere({
      fill: '#f8fafc',
      stroke: '#cbd5e1',
    })

    const [sphere] = wrapper.findAll('path')

    expect(sphere.attributes('fill')).toBe('#f8fafc')
    expect(sphere.attributes('stroke')).toBe('#cbd5e1')
  })

  it('allows users to keep sphere outside zoomed content', () => {
    const wrapper = mount(MapBase, {
      props: {
        fit: sampleGeoJson,
      },
      slots: {
        default: () => [
          h(MapSphere),
          h(MapZoom, {}, {
            default: () => [
              h(MapGraticule, { 'data-testid': 'map-graticule-lines' }),
              h(MapFeatures),
            ],
          }),
        ],
      },
    })

    const zoomGroup = wrapper.get('[name="zoom"]')
    const sphere = wrapper.get('[name="sphere"]')
    const graticule = wrapper.get('[name="graticule"]')

    expect(sphere.element.parentElement).not.toBe(zoomGroup.element)
    expect(graticule.element.parentElement).toBe(zoomGroup.element)
  })

  it('throws without map context', () => {
    expect(() => mount(MapSphere)).toThrow('useMapContext must be used inside MapBase')
  })
})
