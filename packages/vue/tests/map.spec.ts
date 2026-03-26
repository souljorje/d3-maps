import { describe, expect, it } from 'vitest'

import type { MapContext } from '@d3-maps/core'
import type { PropType } from 'vue'

import { mount } from '@vue/test-utils'
import {
  defineComponent,
  h,
} from 'vue'

import {
  MapBase,
  MapFeatures,
  useCreateMapContext,
} from '../src'
import {
  sampleGeoJson,
  sampleGeoJsonTwoFeatures,
} from './fixtures'

describe('map', () => {
  it('renders default viewBox from map defaults', () => {
    const wrapper = mount(MapBase, {
      props: {
        data: sampleGeoJson,
        'data-testid': 'map-svg',
      },
    })

    expect(wrapper.get('[data-testid="map-svg"]').attributes('viewBox')).toBe('0 0 600 300')
  })

  it('renders scoped-slot children with map context', () => {
    const wrapper = mount(MapBase, {
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
    const wrapper = mount(MapBase, {
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

  it('renders with an external context object shared with sibling UI', () => {
    const Toolbar = defineComponent({
      props: {
        context: {
          type: Object as PropType<MapContext>,
          required: true,
        },
      },
      setup(props) {
        return () => h('div', {
          'data-testid': 'toolbar-count',
        }, String(props.context.features.length))
      },
    })

    const Harness = defineComponent({
      setup() {
        const context = useCreateMapContext({
          data: sampleGeoJson,
          width: 420,
        })

        return () => {
          const mapContext = context.value
          if (!mapContext) return null

          return [
            h(Toolbar, {
              context: mapContext,
            }),
            h(MapBase as any, {
              context: mapContext,
              'data-testid': 'map-svg',
            }, {
              default: () => h(MapFeatures),
            }),
          ]
        }
      },
    })

    const wrapper = mount(Harness)

    expect(wrapper.get('[data-testid="toolbar-count"]').text()).toBe('1')
    expect(wrapper.get('[data-testid="map-svg"]').attributes('viewBox')).toBe('0 0 420 210')
    expect(wrapper.findAll('path')).toHaveLength(1)
  })
})
