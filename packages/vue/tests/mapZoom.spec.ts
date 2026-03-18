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
} from '@d3-maps/core'

import { mount } from '@vue/test-utils'
import {
  defineComponent,
  h,
} from 'vue'

import {
  Map,
  MapZoom,
} from '../src'
import { sampleGeoJson } from './fixtures'

const setupZoomSpy = vi.fn()
const applyZoomSpy = vi.fn()
let zoomBehaviorOptions: ZoomBehaviorOptions | undefined
function createZoomEvent(transform: string) {
  return ({
    transform: {
      toString: () => transform,
    },
  }) as unknown as ZoomEvent
}

vi.mock('@d3-maps/core', async () => {
  const actual = await vi.importActual<typeof import('@d3-maps/core')>('@d3-maps/core')

  return {
    ...actual,
    setupZoom: (...args: Parameters<typeof actual.setupZoom>) => {
      setupZoomSpy(...args)
      zoomBehaviorOptions?.onZoomStart?.(createZoomEvent('translate(1,2) scale(3)'))
      zoomBehaviorOptions?.onZoom?.(createZoomEvent('translate(3,4) scale(5)'))
      zoomBehaviorOptions?.onZoomEnd?.(createZoomEvent('translate(3,4) scale(5)'))
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

  it('wires zoom setup and transform updates', async () => {
    const onZoomstart = vi.fn()
    const onZoom = vi.fn()
    const onZoomend = vi.fn()

    const wrapper = mount(defineComponent({
      data() {
        return {
          center: [11, 12] as [number, number],
          zoom: 2,
        }
      },
      render() {
        return h(Map, {
          data: sampleGeoJson,
        }, {
          default: () => h(MapZoom, {
            'data-testid': 'map-zoom-group',
            center: this.center,
            zoom: this.zoom,
            minZoom: 1,
            maxZoom: 6,
            config: { scaleExtent: [[1, 6]] },
            onZoomstart,
            onZoom,
            onZoomend,
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
        zoom: 2,
      }),
    )
    expect(applyZoomSpy).not.toHaveBeenCalled()
    expect(onZoomstart).toHaveBeenCalled()
    expect(onZoom).toHaveBeenCalled()
    expect(onZoomend).toHaveBeenCalled()
    expect(zoomBehaviorOptions?.config).toEqual({ scaleExtent: [[1, 6]] })
    expect(wrapper.get('[data-testid="map-zoom-group"]').attributes('transform')).toContain('translate')

    await wrapper.setData({
      center: [99, 100],
      zoom: 3,
    })

    expect(applyZoomSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        center: [99, 100],
        zoom: 3,
      }),
    )
  })
})
