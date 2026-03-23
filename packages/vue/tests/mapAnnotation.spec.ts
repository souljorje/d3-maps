import {
  describe,
  expect,
  it,
} from 'vitest'

import { mount } from '@vue/test-utils'
import { h } from 'vue'

import {
  MapAnnotation,
  MapBase,
} from '../src'
import { sampleGeoJson } from './fixtures'

function midpointCurve(context: {
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

describe('mapAnnotation', () => {
  it('renders connector and content inside map context', () => {
    const wrapper = mount(MapBase, {
      props: {
        data: sampleGeoJson,
      },
      slots: {
        default: () => h(MapAnnotation, {
          coordinates: [2.3522, 48.8566],
          'data-testid': 'annotation-line',
          stroke: '#ff6f26',
        }, {
          default: () => h('text', 'Paris'),
        }),
      },
    })

    expect(wrapper.get('[name="annotation"]').attributes('transform')).toMatch(/^translate/)
    expect(wrapper.get('[data-testid="annotation-line"]').attributes('name')).toBe('annotation-line')
    expect(wrapper.get('[data-testid="annotation-line"]').attributes('d')).toMatch(/^M/)
    expect(wrapper.get('[data-testid="annotation-line"]').attributes('stroke')).toBe('#ff6f26')
    expect(wrapper.text()).toContain('Paris')
    expect(wrapper.find('[name="annotation-content"]').attributes('transform')).toMatch(/^translate/)
    expect(wrapper.find('[name="annotation-content"]').attributes('transform')).not.toContain('rotate')
  })

  it('does not render outside map context', () => {
    const wrapper = mount(MapAnnotation, {
      props: {
        coordinates: [2.3522, 48.8566],
      },
      attrs: {
        'data-testid': 'annotation-line',
      },
      slots: {
        default: () => h('text', 'Paris'),
      },
    })

    expect(wrapper.find('[data-testid="annotation-line"]').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('Paris')
  })

  it('uses the provided D3 curve for the connector path', () => {
    const linearWrapper = mount(MapBase, {
      props: {
        data: sampleGeoJson,
      },
      slots: {
        default: () => h(MapAnnotation, {
          coordinates: [2.3522, 48.8566],
          'data-testid': 'annotation-line',
          midpoint: [0, -0.4],
        }, {
          default: () => h('text', 'Paris'),
        }),
      },
    })

    const linearPath = linearWrapper.find('[data-testid="annotation-line"]').attributes('d')
    linearWrapper.unmount()

    const curvedWrapper = mount(MapBase, {
      props: {
        data: sampleGeoJson,
      },
      slots: {
        default: () => h(MapAnnotation, {
          coordinates: [2.3522, 48.8566],
          curve: midpointCurve,
          midpoint: [0, -0.4],
          'data-testid': 'annotation-line',
        }, {
          default: () => h('text', 'Paris'),
        }),
      },
    })

    expect(curvedWrapper.find('[data-testid="annotation-line"]').attributes('d')).not.toBe(linearPath)
  })
})
