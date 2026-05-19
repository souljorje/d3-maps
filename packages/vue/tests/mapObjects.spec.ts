import { describe, expect, it } from 'vitest'

import type { MapObjectData } from '@d3-maps/core'

import { mount } from '@vue/test-utils'
import { h } from 'vue'

import {
  isFeature,
  MapBase,
  MapObject,
  MapObjects,
} from '../src'
import {
  sampleGeoJson,
  sampleGeometryCollection,
  sampleGeometryCollectionFeature,
  sampleTopologyObjectKey,
  sampleTopologyTwoObjects,
} from './fixtures'

const MapObjectComponent = MapObject as unknown as Parameters<typeof h>[0]

describe('mapObjects', () => {
  it('renders normalized objects by default', () => {
    const wrapper = mount(MapBase, {
      props: {
        data: sampleGeometryCollection,
      },
      slots: {
        default: () => h(MapObjects),
      },
    })

    expect(wrapper.findAll('path')).toHaveLength(2)
  })

  it('supports scoped-slot children', () => {
    const wrapper = mount(MapBase, {
      props: {
        data: sampleTopologyTwoObjects,
        objectKey: sampleTopologyObjectKey,
      },
      slots: {
        default: () => h(
          MapObjects,
          {},
          {
            default: ({ objects }: { objects: MapObjectData[] }) =>
              h('g', {
                'data-testid': 'map-objects-group',
                'data-count': String(objects.length),
              }, objects.map(({ key, d }) => h(
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

    expect(wrapper.get('[data-testid="map-objects-group"]').attributes('data-count')).toBe('2')
    expect(wrapper.findAll('path')).toHaveLength(2)
  })

  it('forwards styles to default-rendered objects', async () => {
    const wrapper = mount(MapBase, {
      props: {
        data: sampleGeoJson,
      },
      slots: {
        default: () => h(MapObjects, {
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
        data: sampleGeoJson,
      },
      slots: {
        default: () => h(MapObjects, {
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
        data: sampleTopologyTwoObjects,
        objectKey: sampleTopologyObjectKey,
      },
      slots: {
        default: () => h(MapObjects, {
          dataTransformer: (objects) => objects.slice(0, 1),
        }),
      },
    })

    expect(wrapper.findAll('path')).toHaveLength(1)
  })

  it('supports custom object keys', () => {
    const wrapper = mount(MapBase, {
      props: {
        data: sampleGeoJson,
      },
      slots: {
        default: () => h(
          MapObjects,
          {
            getKey: (item, index) => isFeature(item)
              ? item.properties?.id ?? `custom-${index}`
              : undefined,
          },
          {
            default: ({ objects }: { objects: MapObjectData[] }) =>
              h('g', { 'data-testid': 'map-object-keys' }, objects.map(({ key }) => h('g', {
                key,
                'data-key': String(key),
              }))),
          },
        ),
      },
    })

    expect(wrapper.get('[data-testid="map-object-keys"] [data-key="demo"]').exists()).toBe(true)
  })

  it('preserves feature geometry collections as single objects', () => {
    const wrapper = mount(MapBase, {
      props: {
        data: sampleGeometryCollectionFeature,
      },
      slots: {
        default: () => h(MapObjects),
      },
    })

    expect(wrapper.findAll('path')).toHaveLength(1)
  })

  it('accepts native svg attrs on the objects group', () => {
    const wrapper = mount(MapBase, {
      props: {
        data: sampleGeoJson,
      },
      slots: {
        default: () => h(MapObjects, { fill: 'darkorange' }),
      },
    })

    expect(wrapper.find('g[name="objects"]').attributes('fill')).toBe('darkorange')
  })

  it('supports layer objectKey overrides', () => {
    const wrapper = mount(MapBase, {
      props: {
        data: sampleTopologyTwoObjects,
      },
      slots: {
        default: () => h(MapObjects, {
          objectKey: sampleTopologyObjectKey,
        }),
      },
    })

    expect(wrapper.findAll('path')).toHaveLength(2)
  })
})
