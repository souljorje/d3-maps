import { describe, expect, it } from 'vitest'

import { mount } from '@vue/test-utils'
import { h } from 'vue'

import {
  Map,
  MapLine,
} from '../src'
import { sampleGeoJson } from './fixtures'

const LINE_COORDINATES: [number, number][] = [
  [-122.4194, 37.7749],
  [-73.935242, 40.73061],
]
const THREE_POINT_COORDINATES: [number, number][] = [
  [-122.4194, 37.7749],
  [-98.5795, 39.8283],
  [-73.935242, 40.73061],
]

describe('mapLine', () => {
  it('renders a projected path inside map context', () => {
    const wrapper = mount(Map, {
      props: {
        data: sampleGeoJson,
      },
      slots: {
        default: () => h(MapLine, {
          coordinates: LINE_COORDINATES,
          'data-testid': 'map-line',
        }),
      },
    })

    expect(wrapper.find('[data-testid="map-line"]').attributes('d')).toMatch(/^M/)
  })

  it('recomputes path when map context changes', async () => {
    const wrapper = mount(Map, {
      props: {
        data: sampleGeoJson,
        width: 300,
      },
      slots: {
        default: () => h(MapLine, {
          coordinates: LINE_COORDINATES,
          'data-testid': 'map-line-recomputed',
        }),
      },
    })

    const initialPath = wrapper.find('[data-testid="map-line-recomputed"]').attributes('d')

    await wrapper.setProps({
      width: 700,
    })

    const nextPath = wrapper.find('[data-testid="map-line-recomputed"]').attributes('d')
    expect(nextPath).not.toBe(initialPath)
  })

  it('renders a path for multi-point coordinates', () => {
    const wrapper = mount(Map, {
      props: {
        data: sampleGeoJson,
      },
      slots: {
        default: () => h(MapLine, {
          coordinates: THREE_POINT_COORDINATES,
          'data-testid': 'map-line-multi-point',
        }),
      },
    })

    expect(wrapper.find('[data-testid="map-line-multi-point"]').attributes('d')).toMatch(/^M/)
  })
})
