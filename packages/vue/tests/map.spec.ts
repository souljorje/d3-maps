import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

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
  sampleTopologyTwoObjects,
} from './fixtures'

const makeMapContextSpy = vi.hoisted(() => vi.fn())

vi.mock('@d3-maps/core', async () => {
  const actual = await vi.importActual<typeof import('@d3-maps/core')>('@d3-maps/core')

  return {
    ...actual,
    makeMapContext: (...args: Parameters<typeof actual.makeMapContext>) => {
      makeMapContextSpy(...args)
      return actual.makeMapContext(...args)
    },
  }
})

describe('map', () => {
  beforeEach(() => {
    makeMapContextSpy.mockClear()
  })

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

  it('updates rendered features when topologyObjectKey changes', async () => {
    const wrapper = mount(MapBase, {
      props: {
        data: sampleTopologyTwoObjects,
      },
      slots: {
        default: () => h(MapFeatures),
      },
    })

    expect(wrapper.findAll('path')).toHaveLength(1)

    await wrapper.setProps({
      topologyObjectKey: 'pair',
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

  it('does not recreate map context on parent rerender with stable props', async () => {
    const stableTransformer = (features: typeof sampleGeoJson.features) => features

    const Harness = defineComponent({
      data() {
        return {
          tick: 0,
        }
      },
      render() {
        return h('div', { 'data-tick': String(this.tick) }, [
          h(MapBase, {
            data: sampleGeoJson,
            width: 420,
            dataTransformer: stableTransformer,
          }, {
            default: () => h(MapFeatures),
          }),
        ])
      },
    })

    const wrapper = mount(Harness)

    expect(makeMapContextSpy).toHaveBeenCalledTimes(1)

    await wrapper.setData({
      tick: 1,
    })

    expect(makeMapContextSpy).toHaveBeenCalledTimes(1)
  })
})
