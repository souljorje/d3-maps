import { describe, expect, it } from 'vitest'

import { mount } from '@vue/test-utils'
import { h } from 'vue'

import {
  MapBase,
  MapMesh,
} from '../src'
import {
  sampleGeoJson,
  sampleTopology,
  sampleTopologyObjectKey,
  sampleTopologyTwoObjects,
} from './fixtures'

describe('mapMesh', () => {
  it('renders mesh for topology data with default fill', () => {
    const wrapper = mount(MapBase, {
      props: {
        data: sampleTopology,
      },
      slots: {
        default: () => h(MapMesh, {
          'data-testid': 'map-mesh',
          stroke: '#000',
        }),
      },
    })

    expect(wrapper.get('[data-testid="map-mesh"]').attributes('fill')).toBe('none')
  })

  it('renders mesh path without topology geometry', () => {
    const wrapper = mount(MapBase, {
      props: {
        data: sampleGeoJson,
      },
      slots: {
        default: () => h(MapMesh),
      },
    })

    const path = wrapper.get('path')
    expect(path.attributes('d')).toBeUndefined()
  })

  it('supports topology overrides', () => {
    const wrapper = mount(MapBase, {
      props: {
        data: sampleGeoJson,
      },
      slots: {
        default: () => h(MapMesh, {
          data: sampleTopologyTwoObjects,
          objectKey: sampleTopologyObjectKey,
        }),
      },
    })

    expect(wrapper.get('path').attributes('d')).toBeTruthy()
  })

  it('supports objectKey overrides from context', () => {
    const wrapper = mount(MapBase, {
      props: {
        data: sampleTopologyTwoObjects,
      },
      slots: {
        default: () => h(MapMesh, {
          objectKey: sampleTopologyObjectKey,
        }),
      },
    })

    expect(wrapper.get('path').attributes('d')).toBeTruthy()
  })
})
