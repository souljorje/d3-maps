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
  it('allows overriding stroke and fill', () => {
    const wrapper = mountWithMapSphere({
      fill: '#f8fafc',
      stroke: '#cbd5e1',
    })

    const background = wrapper.get('[data-d3m="sphere-background"]')
    const border = wrapper.get('[data-d3m="sphere-border"]')

    expect(background.attributes('fill')).toBe('#f8fafc')
    expect(background.attributes('stroke')).toBe('none')
    expect(border.attributes('fill')).toBe('none')
    expect(border.attributes('stroke')).toBe('#cbd5e1')
  })

  it('wraps children between background and border paths', () => {
    const wrapper = mount(MapBase, {
      props: {
        fit: sampleGeoJson,
      },
      slots: {
        default: () => h(MapSphere, {
          fill: '#f8fafc',
          stroke: '#cbd5e1',
        }, {
          default: () => h(MapGraticule, { 'data-testid': 'map-graticule-lines' }),
        }),
      },
    })

    const sphereChildren = Array.from(wrapper.get('[data-d3m="sphere"]').element.children)
      .map((child) => child.getAttribute('data-d3m'))
      .filter(Boolean)
    const content = wrapper.get('[data-d3m="sphere-content"]')
    const clipPath = wrapper.get('clipPath')

    expect(sphereChildren).toEqual([
      'sphere-background',
      'sphere-content',
      'sphere-border',
    ])
    expect(content.attributes('clip-path')).toBe(`url(#${clipPath.attributes('id')})`)
    expect(content.find('[data-d3m="graticule"]').exists()).toBe(true)
  })

  it('allows disabling child clipping', () => {
    const wrapper = mount(MapBase, {
      props: {
        fit: sampleGeoJson,
      },
      slots: {
        default: () => h(MapSphere, {
          noClip: true,
        }, {
          default: () => h(MapGraticule),
        }),
      },
    })

    const content = wrapper.get('[data-d3m="sphere-content"]')

    expect(wrapper.find('clipPath').exists()).toBe(false)
    expect(content.attributes('clip-path')).toBeUndefined()
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

    const zoomGroup = wrapper.get('[data-d3m="zoom"]')
    const sphere = wrapper.get('[data-d3m="sphere"]')
    const graticule = wrapper.get('[data-d3m="graticule"]')

    expect(sphere.element.parentElement).not.toBe(zoomGroup.element)
    expect(graticule.element.parentElement).toBe(zoomGroup.element)
  })

  it('throws without map context', () => {
    expect(() => mount(MapSphere)).toThrow('useMapContext must be used inside MapBase')
  })
})
