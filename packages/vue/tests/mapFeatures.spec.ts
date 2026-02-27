import { describe, expect, it } from 'vitest'

import type { MapFeature as D3MapFeature } from '@d3-maps/core'

import { mount } from '@vue/test-utils'
import { h } from 'vue'

import {
  Map,
  MapFeature,
  MapFeatures,
} from '../src'
import { sampleGeoJson } from './fixtures'

describe('mapFeatures', () => {
  it('renders features by default', () => {
    const wrapper = mount(Map, {
      props: {
        data: sampleGeoJson,
      },
      slots: {
        default: () => h(MapFeatures),
      },
    })

    expect(wrapper.findAll('path')).toHaveLength(1)
  })

  it('supports scoped-slot children', () => {
    const wrapper = mount(Map, {
      props: {
        data: sampleGeoJson,
      },
      slots: {
        default: () => h(
          MapFeatures,
          {},
          {
            default: ({ features }: { features: D3MapFeature[] }) =>
              h('g', {
                'data-testid': 'map-features-group',
                'data-count': String(features.length),
              }, features.map((feature, index) => h(MapFeature, {
                key: `${String(feature.id)}-${index}`,
                data: feature,
              }))),
          },
        ),
      },
    })

    expect(wrapper.get('[data-testid="map-features-group"]').attributes('data-count')).toBe('1')
    expect(wrapper.findAll('path')).toHaveLength(1)
  })

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
