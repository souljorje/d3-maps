import { describe, expect, it } from 'vitest'

import type { RenderedGeometry } from '@d3-maps/core'

import { mount } from '@vue/test-utils'
import { h } from 'vue'

import {
  MapBase,
  MapGeometries,
  MapObject,
} from '../src'
import {
  sampleGeometryCollection,
  samplePolygon,
} from './fixtures'

const MapObjectComponent = MapObject as unknown as Parameters<typeof h>[0]

describe('mapGeometries', () => {
  it('renders normalized geometry objects by default', () => {
    const wrapper = mount(MapBase, {
      props: {
        data: sampleGeometryCollection,
      },
      slots: {
        default: () => h(MapGeometries),
      },
    })

    expect(wrapper.findAll('path')).toHaveLength(2)
  })

  it('supports scoped-slot children', () => {
    const wrapper = mount(MapBase, {
      props: {
        data: sampleGeometryCollection,
      },
      slots: {
        default: () => h(
          MapGeometries,
          {},
          {
            default: ({ geometries }: { geometries: RenderedGeometry[] }) =>
              h('g', {
                'data-testid': 'map-geometries-group',
                'data-count': String(geometries.length),
              }, geometries.map(({ key, d }) => h(
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

    expect(wrapper.get('[data-testid="map-geometries-group"]').attributes('data-count')).toBe('2')
    expect(wrapper.findAll('path')).toHaveLength(2)
  })

  it('renders a single geometry object', () => {
    const wrapper = mount(MapBase, {
      props: {
        data: samplePolygon,
      },
      slots: {
        default: () => h(MapGeometries),
      },
    })

    expect(wrapper.findAll('path')).toHaveLength(1)
  })
})
