import { describe, expect, it } from 'vitest'

import type { MapFeatureData as D3MapFeatureData } from '@d3-maps/core'

import { mount } from '@vue/test-utils'
import {
  defineComponent,
  h,
  onUpdated,
} from 'vue'

import {
  MapBase,
  MapFeature,
  MapFeatures,
} from '../src'
import {
  sampleGeoJson,
  sampleGeoJsonTwoFeatures,
} from './fixtures'

describe('mapFeatures', () => {
  it('renders features by default', () => {
    const wrapper = mount(MapBase, {
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
    const wrapper = mount(MapBase, {
      props: {
        data: sampleGeoJson,
      },
      slots: {
        default: () => h(
          MapFeatures,
          {},
          {
            default: ({ features }: { features: D3MapFeatureData[] }) =>
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
    const wrapper = mount(MapBase, {
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
    const wrapper = mount(MapBase, {
      props: {
        data: sampleGeoJson,
      },
      slots: {
        default: () => h(MapFeatures, { fill: 'darkorange' }),
      },
    })

    expect(wrapper.find('g[name="features"]').attributes('fill')).toBe('darkorange')
  })

  it('rerenders default feature items only when feature or style deps change', async () => {
    let featureRenderCount = 0
    let featureUpdateCount = 0

    const MapFeatureStub = defineComponent({
      name: 'MapFeature',
      setup() {
        onUpdated(() => {
          featureUpdateCount += 1
        })

        return () => {
          featureRenderCount += 1
          return h('path', { 'data-testid': 'stub-feature' })
        }
      },
    })

    const Harness = defineComponent({
      data() {
        return {
          tick: 0,
          styles: {
            default: { opacity: 0.9 },
          },
        }
      },
      render() {
        return h('div', { 'data-tick': String(this.tick) }, [
          h(MapBase, {
            data: sampleGeoJsonTwoFeatures,
          }, {
            default: () => h(MapFeatures, {
              styles: this.styles,
            }),
          }),
        ])
      },
    })

    const wrapper = mount(Harness, {
      global: {
        stubs: {
          MapFeature: MapFeatureStub,
        },
      },
    })

    expect(wrapper.findAll('[data-testid="stub-feature"]')).toHaveLength(2)
    expect(featureRenderCount).toBe(2)
    expect(featureUpdateCount).toBe(0)

    await wrapper.setData({
      tick: 1,
    })

    expect(featureRenderCount).toBe(2)
    expect(featureUpdateCount).toBe(0)

    await wrapper.setData({
      styles: {
        default: { opacity: 0.7 },
      },
    })

    expect(featureRenderCount).toBe(4)
    expect(featureUpdateCount).toBe(2)
  })
})
