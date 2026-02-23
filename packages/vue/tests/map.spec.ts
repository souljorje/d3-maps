import { describe, expect, it } from 'vitest'

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
  it('updates injected map context when map props change', async () => {
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
