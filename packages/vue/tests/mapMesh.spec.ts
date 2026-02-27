import { describe, expect, it } from 'vitest'

import { mount } from '@vue/test-utils'
import { h } from 'vue'

import {
  Map,
  MapMesh,
} from '../src'
import {
  sampleGeoJson,
  sampleTopology,
} from './fixtures'

describe('mapMesh', () => {
  it('renders mesh for topology data with default fill', () => {
    const wrapper = mount(Map, {
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
    const wrapper = mount(Map, {
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
})
