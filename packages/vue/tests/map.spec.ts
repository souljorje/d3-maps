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
  nextTick,
  ref,
} from 'vue'

import {
  MapBase,
  MapFeatures,
  useCreateMapContext,
} from '../src'
import {
  sampleGeoJson,
  sampleGeoJsonTwoFeatures,
  sampleTopologyObjectKey,
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
        'data-testid': 'map-svg',
      },
    })

    expect(wrapper.get('[data-testid="map-svg"]').attributes('viewBox')).toBe('0 0 600 300')
  })

  it('renders scoped-slot children with map context', () => {
    const wrapper = mount(MapBase, {
      props: {
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

  it('updates rendered objects when layer data changes', async () => {
    const currentFit = ref(sampleGeoJson)
    const currentData = ref(sampleGeoJson)

    const Harness = defineComponent({
      setup() {
        return () => h(MapBase, {
          fit: currentFit.value,
        }, {
          default: () => h(MapFeatures, {
            data: currentData.value,
          }),
        })
      },
    })

    const wrapper = mount(Harness)

    expect(wrapper.findAll('path')).toHaveLength(1)

    currentFit.value = sampleGeoJsonTwoFeatures
    currentData.value = sampleGeoJsonTwoFeatures
    await nextTick()

    expect(wrapper.findAll('path')).toHaveLength(2)
  })

  it('updates rendered objects when topology data and objectKey change', async () => {
    const currentFit = ref(sampleGeoJson as typeof sampleGeoJson | typeof sampleTopologyTwoObjects)
    const currentFitObjectKey = ref<string | undefined>(undefined)
    const currentData = ref(sampleGeoJson as typeof sampleGeoJson | typeof sampleTopologyTwoObjects)
    const currentObjectKey = ref<string | undefined>(undefined)

    const Harness = defineComponent({
      setup() {
        return () => h(MapBase, {
          fit: currentFit.value,
          fitObjectKey: currentFitObjectKey.value,
        }, {
          default: () => h(MapFeatures, {
            data: currentData.value,
            objectKey: currentObjectKey.value,
          }),
        })
      },
    })

    const wrapper = mount(Harness)

    expect(wrapper.findAll('path')).toHaveLength(1)

    currentFit.value = sampleTopologyTwoObjects
    currentFitObjectKey.value = sampleTopologyObjectKey
    currentData.value = sampleTopologyTwoObjects
    currentObjectKey.value = sampleTopologyObjectKey
    await nextTick()

    expect(wrapper.findAll('path')).toHaveLength(2)
  })

  it('creates context without shared data for layer-local manual maps', () => {
    const wrapper = mount(MapBase, {
      props: {
        fit: 'manual',
        projectionConfig: {
          scale: 160,
          translate: [[450, 250]],
        },
      },
      slots: {
        default: () => h(MapFeatures, {
          data: sampleTopologyTwoObjects,
          objectKey: sampleTopologyObjectKey,
        }),
      },
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
          'data-testid': 'toolbar-width',
        }, String(props.context.width))
      },
    })

    const Harness = defineComponent({
      setup() {
        const context = useCreateMapContext({
          fit: sampleGeoJson,
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
              default: () => h(MapFeatures, {
                data: sampleGeoJson,
              }),
            }),
          ]
        }
      },
    })

    const wrapper = mount(Harness)

    expect(wrapper.get('[data-testid="toolbar-width"]').text()).toBe('420')
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
