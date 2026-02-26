import { describe, expect, it } from 'vitest'

import { mount } from '@vue/test-utils'
import { h } from 'vue'

import {
  Map,
  MapFeatures,
} from '../src'
import { sampleGeoJson } from './fixtures'

describe('mapFeatures', () => {
  it('forwards styles to default-rendered features', async () => {
    const wrapper = mount(Map, {
      props: {
        data: sampleGeoJson,
      },
      slots: {
        default: () => h(MapFeatures, {
          styles: {
            default: { opacity: 0.9 },
            hover: { opacity: 0.7 },
          },
        }),
      },
    })

    const path = wrapper.find('path')
    expect((path.element as SVGPathElement).style.opacity).toBe('0.9')

    await path.trigger('mouseenter')
    expect((path.element as SVGPathElement).style.opacity).toBe('0.7')
  })

  it('accepts native svg attrs on features group', () => {
    const wrapper = mount(Map, {
      props: {
        data: sampleGeoJson,
      },
      slots: {
        default: () => h(MapFeatures, { fill: 'darkorange' }),
      },
    })

    expect(wrapper.find('g[name="features"]').attributes('fill')).toBe('darkorange')
  })
})
