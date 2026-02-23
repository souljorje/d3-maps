import { describe, expect, it } from 'vitest'

import { mount } from '@vue/test-utils'
import { h } from 'vue'

import {
  Map,
  MapMarker,
} from '../src'
import { sampleGeoJson } from './fixtures'

describe('mapMarker', () => {
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
