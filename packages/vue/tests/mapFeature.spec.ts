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
import { mapZoomKey } from '../src/hooks/useMapZoom'
import { sampleGeoJson } from './fixtures'

describe('mapFeature', () => {
  it('throws without map context', () => {
    expect(() => mount(MapFeature, {
      props: {
        data: sampleGeoJson.features[0],
      },
    })).toThrowError('useMapContext must be used inside Map')
  })

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
          tabindex: 0,
          styles: {
            default: { opacity: 0.9 },
            focus: { opacity: 0.85 },
            hover: { opacity: 0.8 },
            active: { opacity: 0.7 },
          },
          onMouseup,
        }),
      },
    })

    const path = wrapper.get('[data-testid="map-feature"]')
    expect((path.element as SVGPathElement).style.opacity).toBe('0.9')

    await path.trigger('focus')
    expect((path.element as SVGPathElement).style.opacity).toBe('0.85')

    await path.trigger('mouseenter')
    expect((path.element as SVGPathElement).style.opacity).toBe('0.85')

    await path.trigger('mousedown')
    expect((path.element as SVGPathElement).style.opacity).toBe('0.7')

    await path.trigger('mouseup')
    expect((path.element as SVGPathElement).style.opacity).toBe('0.85')
    expect(onMouseup).toHaveBeenCalledTimes(1)

    await path.trigger('mouseleave')
    expect((path.element as SVGPathElement).style.opacity).toBe('0.85')

    await path.trigger('blur')
    expect((path.element as SVGPathElement).style.opacity).toBe('0.9')
  })

  it('resets active state on global mouseup when element mouseup is missed', async () => {
    const wrapper = mount(MapBase, {
      global: {
        provide: {
          [mapZoomKey as symbol]: {
            center: { value: undefined },
            zoom: { value: 1 },
            minZoom: { value: 1 },
            maxZoom: { value: 8 },
            setCenter: vi.fn(),
            setZoom: vi.fn(),
            zoomTo: vi.fn(),
            zoomToObject: vi.fn(),
            reset: vi.fn(),
          },
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
