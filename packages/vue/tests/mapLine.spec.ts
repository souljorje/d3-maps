import { describe, expect, it } from 'vitest'

import { mount } from '@vue/test-utils'
import { h } from 'vue'

import {
  MapBase,
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
function curveOffsetCurve(context: {
  moveTo: (x: number, y: number) => void
  lineTo: (x: number, y: number) => void
}) {
  let pointIndex = 0

  return {
    lineStart() {
      pointIndex = 0
    },
    lineEnd() {},
    point(x: number, y: number) {
      if (pointIndex === 0) {
        context.moveTo(x, y)
      } else {
        context.lineTo(x, y + 1)
      }

      pointIndex += 1
    },
  }
}

describe('mapLine', () => {
  it('renders a projected path inside map context', () => {
    const wrapper = mount(MapBase, {
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
    const wrapper = mount(MapBase, {
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

  it('renders cartesian paths without map context', () => {
    const wrapper = mount(MapLine, {
      props: {
        coordinates: [
          [0, 0],
          [40, 0],
        ],
        cartesian: true,
      },
      attrs: {
        'data-testid': 'map-line-cartesian',
      },
    })

    expect(wrapper.find('[data-testid="map-line-cartesian"]').attributes('d')).toBe('M0,0L40,0')
  })

  it('renders a path for multi-point coordinates', () => {
    const wrapper = mount(MapBase, {
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

  it('supports custom projected paths', () => {
    const wrapper = mount(MapBase, {
      props: {
        data: sampleGeoJson,
      },
      slots: {
        default: () => h(MapLine, {
          coordinates: THREE_POINT_COORDINATES,
          custom: true,
          'data-testid': 'map-line-custom',
        }),
      },
    })

    expect(wrapper.find('[data-testid="map-line-custom"]').attributes('d')).toMatch(/^M/)
  })

  it('uses the provided D3 curve for custom paths', async () => {
    const wrapper = mount(MapBase, {
      props: {
        data: sampleGeoJson,
      },
      slots: {
        default: () => h(MapLine, {
          coordinates: THREE_POINT_COORDINATES,
          custom: true,
          'data-testid': 'map-line-curved',
        }),
      },
    })

    const linearPath = wrapper.find('[data-testid="map-line-curved"]').attributes('d')

    wrapper.unmount()

    const curvedWrapper = mount(MapBase, {
      props: {
        data: sampleGeoJson,
      },
      slots: {
        default: () => h(MapLine, {
          coordinates: THREE_POINT_COORDINATES,
          custom: true,
          curve: curveOffsetCurve,
          'data-testid': 'map-line-curved',
        }),
      },
    })

    expect(curvedWrapper.find('[data-testid="map-line-curved"]').attributes('d')).not.toBe(linearPath)
  })

  it('uses the manual connector renderer when curve is numeric', () => {
    const linearWrapper = mount(MapBase, {
      props: {
        data: sampleGeoJson,
      },
      slots: {
        default: () => h(MapLine, {
          coordinates: THREE_POINT_COORDINATES,
          custom: true,
          'data-testid': 'map-line-curved',
        }),
      },
    })

    const linearPath = linearWrapper.find('[data-testid="map-line-curved"]').attributes('d')
    linearWrapper.unmount()

    const connectorWrapper = mount(MapBase, {
      props: {
        data: sampleGeoJson,
      },
      slots: {
        default: () => h(MapLine, {
          coordinates: THREE_POINT_COORDINATES,
          custom: true,
          curve: 0.5,
          'data-testid': 'map-line-curved',
        }),
      },
    })

    expect(connectorWrapper.find('[data-testid="map-line-curved"]').attributes('d')).not.toBe(linearPath)
  })

  it('applies midpoint curveOffset for numeric connector paths', () => {
    const baseWrapper = mount(MapLine, {
      props: {
        coordinates: [
          [0, 0],
          [40, 0],
        ],
        cartesian: true,
        curve: 0.5,
      },
      attrs: {
        'data-testid': 'map-line-curveOffset',
      },
    })

    const basePath = baseWrapper.find('[data-testid="map-line-curveOffset"]').attributes('d')
    baseWrapper.unmount()

    const curveOffsetWrapper = mount(MapLine, {
      props: {
        coordinates: [
          [0, 0],
          [40, 0],
        ],
        cartesian: true,
        curve: 0.5,
        curveOffset: [0, -0.4],
      },
      attrs: {
        'data-testid': 'map-line-curveOffset',
      },
    })

    expect(curveOffsetWrapper.find('[data-testid="map-line-curveOffset"]').attributes('d')).not.toBe(basePath)
  })
})
