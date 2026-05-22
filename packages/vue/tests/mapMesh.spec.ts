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
        fit: sampleTopology,
      },
      slots: {
        default: () => h(MapMesh, {
          data: sampleTopology,
          'data-testid': 'map-mesh',
          stroke: '#000',
        }),
      },
    })

    expect(wrapper.get('[data-testid="map-mesh"]').attributes('fill')).toBe('none')
  })

  it('renders an empty path for a missing topology object', () => {
    const wrapper = mount(MapBase, {
      props: {
        fit: sampleGeoJson,
      },
      slots: {
        default: () => h(MapMesh, {
          data: sampleTopologyTwoObjects,
          objectKey: 'missing',
        }),
      },
    })

    const path = wrapper.get('path')
    expect(path.attributes('d')).toBeUndefined()
  })

  it('supports topology overrides', () => {
    const wrapper = mount(MapBase, {
      props: {
        fit: sampleGeoJson,
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

  it('supports explicit objectKey overrides', () => {
    const wrapper = mount(MapBase, {
      props: {
        fit: sampleTopologyTwoObjects,
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
})
