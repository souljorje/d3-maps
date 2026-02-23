import { describe, expect, it, vi } from 'vitest'

import { mount } from '@vue/test-utils'
import { h } from 'vue'

import {
  Map,
  MapZoom,
} from '../src'
import { sampleGeoJson } from './fixtures'

const setupZoomSpy = vi.fn()
const applyZoomTransformSpy = vi.fn()
let zoomBehaviorOptions: any

vi.mock('@d3-maps/core', async () => {
  const actual = await vi.importActual<typeof import('@d3-maps/core')>('@d3-maps/core')

  return {
    ...actual,
    setupZoom: (...args: Parameters<typeof actual.setupZoom>) => {
      setupZoomSpy(...args)
      zoomBehaviorOptions?.onZoomStart?.({ transform: { toString: () => 'translate(1,2) scale(3)' } })
      zoomBehaviorOptions?.onZoom?.({ transform: { toString: () => 'translate(3,4) scale(5)' } })
      zoomBehaviorOptions?.onZoomEnd?.({ transform: { toString: () => 'translate(3,4) scale(5)' } })
    },
    applyZoomTransform: (...args: Parameters<typeof actual.applyZoomTransform>) => {
      applyZoomTransformSpy(...args)
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
  it('wires zoom setup and transform updates', async () => {
    const wrapper = mount(Map, {
      props: {
        data: sampleGeoJson,
      },
      slots: {
        default: () => h(MapZoom, {
          center: [11, 12],
          zoom: 2,
          minZoom: 1,
          maxZoom: 6,
        }),
      },
    })

    await Promise.resolve()

    expect(setupZoomSpy).toHaveBeenCalled()
    expect(applyZoomTransformSpy).toHaveBeenCalled()
    expect(wrapper.find('.d3-map-zoom').attributes('transform')).toContain('translate')
  })
})
