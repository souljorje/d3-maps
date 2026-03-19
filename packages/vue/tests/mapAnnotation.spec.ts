import { describe, expect, it } from 'vitest'

import { mount } from '@vue/test-utils'
import { h } from 'vue'

import {
  Map,
  MapAnnotation,
} from '../src'
import { sampleGeoJson } from './fixtures'

describe('mapAnnotation', () => {
  it('renders connector and content inside map context', () => {
    const wrapper = mount(Map, {
      props: {
        data: sampleGeoJson,
      },
      slots: {
        default: () => h(MapAnnotation, {
          coordinates: [2.3522, 48.8566],
          'data-testid': 'annotation-path',
        }, {
          default: () => h('text', 'Paris'),
        }),
      },
    })

    expect(wrapper.get('[data-testid="annotation-path"]').attributes('d')).toMatch(/^M/)
    expect(wrapper.text()).toContain('Paris')
    expect(wrapper.find('[name="annotation-content"]').attributes('transform')).toMatch(/^translate/)
    expect(wrapper.find('[name="annotation-content"]').attributes('transform')).not.toContain('rotate')
  })

  it('does not render outside map context', () => {
    const wrapper = mount(MapAnnotation, {
      props: {
        coordinates: [2.3522, 48.8566],
        'data-testid': 'annotation-path',
      },
      slots: {
        default: () => h('text', 'Paris'),
      },
    })

    expect(wrapper.find('[data-testid="annotation-path"]').exists()).toBe(false)
    expect(wrapper.text()).toBe('')
  })
})
