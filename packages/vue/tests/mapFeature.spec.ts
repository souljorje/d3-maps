import { describe, expect, it, vi } from 'vitest'

import { mount } from '@vue/test-utils'
import {
  h,
  nextTick,
} from 'vue'

import {
  MapBase,
  MapFeature,
} from '../src'
import { insideZoomKey } from '../src/hooks/useInsideZoom'
import { sampleGeoJson } from './fixtures'

describe('mapFeature', () => {
  it('resolves styles across interaction states', async () => {
    const onMouseup = vi.fn()

    const wrapper = mount(MapBase, {
      props: {
        data: sampleGeoJson,
      },
      slots: {
        default: () => h(MapFeature, {
          'data-testid': 'map-feature',
          data: sampleGeoJson.features[0],
          styles: {
            default: { opacity: 0.9 },
            hover: { opacity: 0.8 },
            active: { opacity: 0.7 },
          },
          onMouseup,
        }),
      },
    })

    const path = wrapper.get('[data-testid="map-feature"]')
    expect((path.element as SVGPathElement).style.opacity).toBe('0.9')

    await path.trigger('mouseenter')
    expect((path.element as SVGPathElement).style.opacity).toBe('0.8')

    await path.trigger('mousedown')
    expect((path.element as SVGPathElement).style.opacity).toBe('0.7')

    await path.trigger('mouseup')
    expect((path.element as SVGPathElement).style.opacity).toBe('0.8')
    expect(onMouseup).toHaveBeenCalledTimes(1)
  })

  it('resets active state on global mouseup when element mouseup is missed', async () => {
    const wrapper = mount(MapBase, {
      global: {
        provide: {
          [insideZoomKey as symbol]: true,
        },
      },
      props: {
        data: sampleGeoJson,
      },
      slots: {
        default: () => h(MapFeature, {
          'data-testid': 'map-feature',
          data: sampleGeoJson.features[0],
          styles: {
            default: { opacity: 0.9 },
            active: { opacity: 0.7 },
          },
        }),
      },
    })

    const path = wrapper.get('[data-testid="map-feature"]')
    expect((path.element as SVGPathElement).style.opacity).toBe('0.9')

    await path.trigger('mousedown')
    expect((path.element as SVGPathElement).style.opacity).toBe('0.7')

    window.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))
    await nextTick()
    expect((path.element as SVGPathElement).style.opacity).toBe('0.9')
  })
})
