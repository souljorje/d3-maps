import { describe, expect, it } from 'vitest'

import type { MapContext } from '@d3-maps/core'

import { mount } from '@vue/test-utils'
import { h } from 'vue'

import {
  Map,
  MapFeatures,
} from '../src'
import {
  sampleGeoJson,
  sampleGeoJsonTwoFeatures,
} from './fixtures'

describe('map', () => {
  it('renders default viewBox from map defaults', () => {
    const wrapper = mount(Map, {
      props: {
        data: sampleGeoJson,
        'data-testid': 'map-svg',
      },
    })

    expect(wrapper.get('[data-testid="map-svg"]').attributes('viewBox')).toBe('0 0 600 300')
  })

  it('renders scoped-slot children with map context', () => {
    const wrapper = mount(Map, {
      props: {
        data: sampleGeoJson,
        width: 420,
      },
      slots: {
        default: (context: MapContext) => h('g', {
          'data-testid': 'map-size-group',
          'data-size': `${context.width}x${context.height}`,
        }),
      },
    })

    expect(wrapper.get('[data-testid="map-size-group"]').attributes('data-size')).toBe('420x210')
  })

  it('updates rendered features when map data prop changes', async () => {
    const wrapper = mount(Map, {
      props: {
        data: sampleGeoJson,
      },
      slots: {
        default: () => h(MapFeatures),
      },
    })

    expect(wrapper.findAll('path')).toHaveLength(1)

    await wrapper.setProps({
      data: sampleGeoJsonTwoFeatures,
    })

    expect(wrapper.findAll('path')).toHaveLength(2)
  })
})
