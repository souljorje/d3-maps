import { describe, expect, it, vi } from 'vitest'

import { mount } from '@vue/test-utils'
import { h } from 'vue'

import {
  Map,
  MapFeature,
} from '../src'
import { sampleGeoJson } from './fixtures'

describe('mapFeature', () => {
  it('renders path without map context', () => {
    const wrapper = mount(MapFeature, {
      props: {
        data: sampleGeoJson.features[0],
      },
    })

    const path = wrapper.get('path')
    expect(path.attributes('d')).toBeUndefined()
  })

  it('resolves styles across interaction states', async () => {
    const onMouseup = vi.fn()

    const wrapper = mount(Map, {
      props: {
        data: sampleGeoJson,
      },
      slots: {
        default: () => h(MapFeature, {
          'data-testid': 'map-feature',
          data: sampleGeoJson.features[0],
          styles: {
            default: { opacity: 0.9 },
            hover: { opacity: 0.8 },
            active: { opacity: 0.7 },
          },
          onMouseup,
        }),
      },
    })

    const path = wrapper.get('[data-testid="map-feature"]')
    expect((path.element as SVGPathElement).style.opacity).toBe('0.9')

    await path.trigger('mouseenter')
    expect((path.element as SVGPathElement).style.opacity).toBe('0.8')

    await path.trigger('mousedown')
    expect((path.element as SVGPathElement).style.opacity).toBe('0.7')

    await path.trigger('mouseup')
    expect((path.element as SVGPathElement).style.opacity).toBe('0.8')
    expect(onMouseup).toHaveBeenCalledTimes(1)
  })
})
