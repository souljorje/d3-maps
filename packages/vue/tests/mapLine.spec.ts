import { describe, expect, it } from 'vitest'

import type { MapLineCurve } from '@d3-maps/core'

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
const offsetCurve: Exclude<MapLineCurve, boolean> = (context) => {
  let isFirstPoint = true

  return {
    lineStart() {
      isFirstPoint = true
    },
    lineEnd() {},
    point(x, y) {
      if (isFirstPoint) {
        context.moveTo(x, y)
        isFirstPoint = false

        return
      }

      context.lineTo(x, y + 12)
    },
  }
}

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

  it('renders a different path when curve mode is enabled', () => {
    const wrapper = mount(Map, {
      props: {
        data: sampleGeoJson,
      },
      slots: {
        default: () => [
          h(MapLine, {
            coordinates: LINE_COORDINATES,
            'data-testid': 'map-line-straight',
          }),
          h(MapLine, {
            coordinates: LINE_COORDINATES,
            curve: true,
            'data-testid': 'map-line-curved',
          }),
        ],
      },
    })

    const straightPath = wrapper.find('[data-testid="map-line-straight"]').attributes('d')
    const curvedPath = wrapper.find('[data-testid="map-line-curved"]').attributes('d')
    expect(curvedPath).not.toBe(straightPath)
  })

  it('accepts a d3 curve factory for projected line shaping', () => {
    const wrapper = mount(Map, {
      props: {
        data: sampleGeoJson,
      },
      slots: {
        default: () => [
          h(MapLine, {
            coordinates: THREE_POINT_COORDINATES,
            'data-testid': 'map-line-linear',
          }),
          h(MapLine, {
            coordinates: THREE_POINT_COORDINATES,
            curve: offsetCurve,
            'data-testid': 'map-line-basis',
          }),
        ],
      },
    })

    const linearPath = wrapper.find('[data-testid="map-line-linear"]').attributes('d')
    const basisPath = wrapper.find('[data-testid="map-line-basis"]').attributes('d')
    expect(basisPath).not.toBe(linearPath)
  })
})
