import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import type {
  ZoomBehaviorOptions,
  ZoomEvent,
  ZoomTransform,
} from '@d3-maps/core'

import { mount } from '@vue/test-utils'
import {
  defineComponent,
  h,
} from 'vue'

import {
  MapBase,
  MapZoom,
  useMapZoom,
} from '../src'
import { sampleGeoJson } from './fixtures'

const setupZoomSpy = vi.fn()
const applyZoomSpy = vi.fn()
let zoomBehaviorOptions: ZoomBehaviorOptions | undefined
function createZoomEvent(center: [number, number] | undefined, zoom: number | undefined) {
  return ({
    transform: createTransform(center, zoom),
  }) as unknown as ZoomEvent
}

vi.mock('@d3-maps/core', async () => {
  const actual = await vi.importActual<typeof import('@d3-maps/core')>('@d3-maps/core')

  return {
    ...actual,
    setupZoom: (...args: Parameters<typeof actual.setupZoom>) => {
      setupZoomSpy(...args)
      zoomBehaviorOptions?.onZoomStart?.(createZoomEvent(args[0].center, args[0].zoom))
      zoomBehaviorOptions?.onZoom?.(createZoomEvent(args[0].center, args[0].zoom))
      zoomBehaviorOptions?.onZoomEnd?.(createZoomEvent(args[0].center, args[0].zoom))
    },
    applyZoom: (...args: Parameters<typeof actual.applyZoom>) => {
      applyZoomSpy(...args)
    },
    createZoomBehavior: (
      _context: Parameters<typeof actual.createZoomBehavior>[0],
      options: Parameters<typeof actual.createZoomBehavior>[1],
    ) => {
      zoomBehaviorOptions = options
      return {} as any
    },
  }
})

describe('mapZoom', () => {
  beforeEach(() => {
    setupZoomSpy.mockClear()
    applyZoomSpy.mockClear()
    zoomBehaviorOptions = undefined
  })

  it('returns undefined outside MapZoom', () => {
    const wrapper = mount(defineComponent({
      setup() {
        const zoom = useMapZoom()
        return () => h('text', { 'data-testid': 'zoom-value' }, String(zoom))
      },
    }))

    expect(wrapper.get('[data-testid="zoom-value"]').text()).toBe('undefined')
  })

  it('wires zoom setup and transform updates', async () => {
    const onZoomStart = vi.fn()
    const onZoom = vi.fn()
    const onZoomEnd = vi.fn()
    const onUpdateCenter = vi.fn()
    const onUpdateZoom = vi.fn()
    const transition = { duration: 250 }

    const wrapper = mount(defineComponent({
      data() {
        return {
          center: [11, 12] as [number, number],
          zoom: 2,
        }
      },
      render() {
        return h(MapBase, {
          data: sampleGeoJson,
        }, {
          default: () => h(MapZoom, {
            'data-testid': 'map-zoom-group',
            center: this.center,
            zoom: this.zoom,
            minZoom: 1,
            maxZoom: 6,
            transition,
            config: { scaleExtent: [[1, 6]] },
            onZoomStart,
            onZoom,
            onZoomEnd,
            'onUpdate:center': onUpdateCenter,
            'onUpdate:zoom': onUpdateZoom,
          }, {
            default: () => h('g', { 'data-testid': 'zoom-content' }),
          }),
        })
      },
    }))

    await Promise.resolve()

    expect(setupZoomSpy).toHaveBeenCalled()
    expect(setupZoomSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        center: [11, 12],
        transition,
        zoom: 2,
      }),
    )
    expect(applyZoomSpy).not.toHaveBeenCalled()
    expect(onZoomStart).toHaveBeenCalled()
    expect(onZoom).toHaveBeenCalled()
    expect(onZoomEnd).toHaveBeenCalled()
    expect(onUpdateCenter).toHaveBeenCalledWith([11, 12])
    expect(onUpdateZoom).toHaveBeenCalledWith(2)
    expect(zoomBehaviorOptions?.config).toEqual({ scaleExtent: [[1, 6]] })
    expect(wrapper.get('[data-testid="map-zoom-group"]').attributes('transform')).toContain('translate')

    await wrapper.setData({
      center: [99, 100],
      zoom: 3,
    })

    expect(setupZoomSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        center: [99, 100],
        transition,
        zoom: 3,
      }),
    )
  })

  it('exposes live zoom state', async () => {
    let zoomApi: ReturnType<typeof useMapZoom> | undefined
    const onZoomToObject = vi.fn()

    const wrapper = mount(defineComponent({
      data() {
        return {
          center: [20, 30] as [number, number],
          zoom: 2,
        }
      },
      render() {
        return h(MapBase, {
          data: sampleGeoJson,
        }, {
          default: () => h(MapZoom, {
            center: this.center,
            zoom: this.zoom,
          }, {
            default: () => h(defineComponent({
              setup() {
                zoomApi = useMapZoom()
                return () => h('text', { 'data-testid': 'zoom-value' }, `${zoomApi?.zoom.value}:${zoomApi?.center.value?.[0] ?? 'none'}`)
              },
            })),
          }),
        })
      },
    }))

    expect(zoomApi?.zoom.value).toBe(2)
    expect(zoomApi?.center.value).toEqual([20, 30])

    zoomApi?.zoomToObject(sampleGeoJson.features[0], onZoomToObject)

    expect(onZoomToObject).toHaveBeenCalledWith(expect.objectContaining({
      center: expect.any(Array),
      zoom: expect.any(Number),
    }))

    await wrapper.setData({
      center: [40, 50],
      zoom: 3,
    })

    expect(zoomApi?.zoom.value).toBe(3)
    expect(zoomApi?.center.value).toEqual([40, 50])
  })
})

function createTransform(
  center: [number, number] | undefined,
  zoom: number | undefined,
): ZoomTransform {
  const resolvedCenter = center ?? [300, 150]
  const resolvedZoom = zoom ?? 1

  return {
    k: resolvedZoom,
    x: 0,
    y: 0,
    invert: () => resolvedCenter,
    toString: () => `translate(0,0) scale(${resolvedZoom})`,
  } as unknown as ZoomTransform
}
