import { describe, expect, it } from 'vitest'

import type { MapFeature } from '@d3-maps/core'

import { mount } from '@vue/test-utils'
import { h } from 'vue'

import {
  isFeature,
  MapBase,
  MapFeatures,
  MapObject,
} from '../src'
import {
  sampleGeoJson,
  sampleGeometryCollection,
  sampleGeometryCollectionFeature,
  sampleTopologyObjectKey,
  sampleTopologyTwoObjects,
} from './fixtures'

const MapObjectComponent = MapObject as unknown as Parameters<typeof h>[0]

describe('mapFeatures', () => {
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
            default: ({ features }: { features: MapFeature[] }) =>
              h('g', {
                'data-testid': 'map-features-group',
                'data-count': String(features.length),
              }, features.map(({ key, d }) => h(
                MapObjectComponent,
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
            getKey: (item, index) => isFeature(item)
              ? item.properties?.id ?? `custom-${index}`
              : undefined,
          },
          {
            default: ({ features }: { features: MapFeature[] }) =>
              h('g', { 'data-testid': 'map-object-keys' }, features.map(({ key }) => h('g', {
                key,
                'data-key': String(key),
              }))),
          },
        ),
      },
    })

    expect(wrapper.find('[data-testid="map-object-keys"] [data-key="demo"]').exists()).toBe(true)
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

    expect(wrapper.find('g[name="features"]').attributes('fill')).toBe('darkorange')
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
})
