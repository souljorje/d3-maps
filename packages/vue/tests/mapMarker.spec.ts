import { describe, expect, it } from 'vitest'

import { mount } from '@vue/test-utils'
import { h } from 'vue'

import {
  Map,
  MapMarker,
} from '../src'
import { sampleGeoJson } from './fixtures'

describe('mapMarker', () => {
  it('uses projection transform from context', () => {
    const wrapper = mount(Map, {
      props: {
        data: sampleGeoJson,
        width: 400,
        height: 300,
      },
      slots: {
        default: () => h(MapMarker, {
          'data-testid': 'map-marker',
          coordinates: [10, 10],
        }),
      },
    })

    expect(wrapper.get('[data-testid="map-marker"]').attributes('transform')).toMatch(/^translate\(/)
  })

  it('uses fallback transform without map context', () => {
    const wrapper = mount(MapMarker, {
      props: {
        'data-testid': 'fallback-map-marker',
        coordinates: [10, 10],
      },
    })

    expect(wrapper.get('[data-testid="fallback-map-marker"]').attributes('transform')).toBe('translate(0, 0)')
  })

  it('recomputes marker transform when map context changes', async () => {
    const wrapper = mount(Map, {
      props: {
        data: sampleGeoJson,
        width: 300,
      },
      slots: {
        default: () => h(MapMarker, { coordinates: [5, 5] }),
      },
    })

    const initialTransform = wrapper.find('g[transform]').attributes('transform')

    await wrapper.setProps({
      width: 700,
    })

    const nextTransform = wrapper.find('g[transform]').attributes('transform')
    expect(nextTransform).not.toBe(initialTransform)
  })
})
