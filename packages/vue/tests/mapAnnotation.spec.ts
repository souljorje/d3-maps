import { describe, expect, it } from 'vitest'

import { mount } from '@vue/test-utils'
import { h } from 'vue'

import {
  MapAnnotation,
  MapBase,
} from '../src'
import { sampleGeoJson } from './fixtures'

describe('mapAnnotation', () => {
  it('renders connector and content inside map context', () => {
    const wrapper = mount(MapBase, {
      props: {
        data: sampleGeoJson,
      },
      slots: {
        default: () => h(MapAnnotation, {
          coordinates: [2.3522, 48.8566],
          'data-testid': 'annotation',
        }, {
          default: () => h('text', 'Paris'),
        }),
      },
    })

    expect(wrapper.get('[data-testid="annotation"]').attributes('name')).toBe('annotation')
    expect(wrapper.find('[name="annotation-line"]').attributes('d')).toMatch(/^M/)
    expect(wrapper.text()).toContain('Paris')
    expect(wrapper.find('[name="annotation-content"]').attributes('transform')).toMatch(/^translate/)
    expect(wrapper.find('[name="annotation-content"]').attributes('transform')).not.toContain('rotate')
  })
})
