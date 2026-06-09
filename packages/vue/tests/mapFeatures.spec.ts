import { describe, expect, it } from 'vitest'

import type { MapFeatureRendered } from '@d3-maps/core'

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
  sampleGeometryCollection,
  sampleGeometryCollectionFeature,
  sampleTopologyObjectKey,
  sampleTopologyTwoObjects,
} from './fixtures'

const MapFeatureComponent = MapFeature as unknown as Parameters<typeof h>[0]

describe('mapFeatures', () => {
  it('renders a standalone feature path', () => {
    const wrapper = mount(MapBase, {
      props: {
        fit: sampleGeoJson,
      },
      slots: {
        default: () => h(MapFeatureComponent, {
          d: 'M0,0L10,0',
        }),
      },
    })

    expect(wrapper.get('path[data-d3m="feature"]').attributes('d')).toBe('M0,0L10,0')
  })

  it('renders normalized features from explicit layer data', () => {
    const wrapper = mount(MapBase, {
      props: {
        fit: sampleGeometryCollection,
      },
      slots: {
        default: () => h(MapFeatures, {
          data: sampleGeometryCollection,
        }),
      },
    })

    expect(wrapper.findAll('path')).toHaveLength(2)
  })

  it('supports scoped-slot children', () => {
    const wrapper = mount(MapBase, {
      props: {
        fit: sampleTopologyTwoObjects,
        fitObjectKey: sampleTopologyObjectKey,
      },
      slots: {
        default: () => h(
          MapFeatures,
          {
            data: sampleTopologyTwoObjects,
            objectKey: sampleTopologyObjectKey,
          },
          {
            default: ({ features }: { features: MapFeatureRendered[] }) =>
              h('g', {
                'data-testid': 'map-features-group',
                'data-count': String(features.length),
              }, features.map(({ key, d }) => h(
                MapFeatureComponent,
                {
                  key,
                  d,
                },
              ))),
          },
        ),
      },
    })

    expect(wrapper.get('[data-testid="map-features-group"]').attributes('data-count')).toBe('2')
    expect(wrapper.findAll('path')).toHaveLength(2)
  })

  it('forwards styles to default-rendered objects', async () => {
    const wrapper = mount(MapBase, {
      props: {
        fit: sampleGeoJson,
      },
      slots: {
        default: () => h(MapFeatures, {
          data: sampleGeoJson,
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

  it('supports explicit layer data overrides', () => {
    const wrapper = mount(MapBase, {
      props: {
        fit: sampleGeoJson,
      },
      slots: {
        default: () => h(MapFeatures, {
          data: sampleTopologyTwoObjects,
          objectKey: sampleTopologyObjectKey,
        }),
      },
    })

    expect(wrapper.findAll('path')).toHaveLength(2)
  })

  it('supports layer-level data transformers', () => {
    const wrapper = mount(MapBase, {
      props: {
        fit: sampleTopologyTwoObjects,
        fitObjectKey: sampleTopologyObjectKey,
      },
      slots: {
        default: () => h(MapFeatures, {
          data: sampleTopologyTwoObjects,
          objectKey: sampleTopologyObjectKey,
          transformer: (objects) => objects.slice(0, 1),
        }),
      },
    })

    expect(wrapper.findAll('path')).toHaveLength(1)
  })

  it('supports filtering in layer-level data transformers', () => {
    const wrapper = mount(MapBase, {
      props: {
        fit: sampleGeoJson,
      },
      slots: {
        default: () => h(MapFeatures, {
          data: sampleGeoJson,
          transformer: (features) => features.filter((feature) => feature.properties.id !== 'demo'),
        }),
      },
    })

    expect(wrapper.findAll('path')).toHaveLength(0)
  })

  it('supports custom object keys', () => {
    const wrapper = mount(MapBase, {
      props: {
        fit: sampleGeoJson,
      },
      slots: {
        default: () => h(
          MapFeatures,
          {
            data: sampleGeoJson,
            getKey: (item, index) => String(item.properties.id ?? `custom-${index}`),
          },
          {
            default: ({ features }: { features: MapFeatureRendered[] }) =>
              h('g', { 'data-testid': 'map-feature-keys' }, features.map(({ key }) => h('g', {
                key,
                'data-key': String(key),
              }))),
          },
        ),
      },
    })

    expect(wrapper.find('[data-testid="map-feature-keys"] [data-key="demo"]').exists()).toBe(true)
  })

  it('preserves feature geometry collections as single objects', () => {
    const wrapper = mount(MapBase, {
      props: {
        fit: sampleGeometryCollectionFeature,
      },
      slots: {
        default: () => h(MapFeatures, {
          data: sampleGeometryCollectionFeature,
        }),
      },
    })

    expect(wrapper.findAll('path')).toHaveLength(1)
  })

  it('accepts native svg attrs on the objects group', () => {
    const wrapper = mount(MapBase, {
      props: {
        fit: sampleGeoJson,
      },
      slots: {
        default: () => h(MapFeatures, {
          data: sampleGeoJson,
          fill: 'darkorange',
        }),
      },
    })

    expect(wrapper.find('g[data-d3m="features"]').attributes('fill')).toBe('darkorange')
  })

  it('supports explicit layer objectKey overrides', () => {
    const wrapper = mount(MapBase, {
      props: {
        fit: sampleTopologyTwoObjects,
      },
      slots: {
        default: () => h(MapFeatures, {
          data: sampleTopologyTwoObjects,
          objectKey: sampleTopologyObjectKey,
        }),
      },
    })

    expect(wrapper.findAll('path')).toHaveLength(2)
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
            fit: sampleGeoJsonTwoFeatures,
          }, {
            default: () => h(MapFeatures, {
              data: sampleGeoJsonTwoFeatures,
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
