import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import type {
  MapContext,
  ZoomCommands,
  ZoomEvent,
  ZoomObject,
} from '@d3-maps/core'

import type { MapZoomRef } from '../src/hooks/useMapZoom'

import {
  getFeatureZoomTransform,
  zoomIdentity,
} from '@d3-maps/core'
import { mount } from '@vue/test-utils'
import {
  defineComponent,
  h,
  inject,
  nextTick,
  useTemplateRef,
} from 'vue'

import {
  MapBase,
  MapZoom,
} from '../src'
import { mapZoomKey } from '../src/hooks/useCreateMapZoom'
import { useMapZoom } from '../src/hooks/useMapZoom'
import { sampleGeoJson } from './fixtures'

const emptyFeature: ZoomObject = {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
      ],
    ],
  },
} as const

describe('mapZoom', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('does not provide zoom context outside MapZoom', () => {
    let injectedZoom: unknown

    const wrapper = mount(defineComponent({
      setup() {
        injectedZoom = inject(mapZoomKey, undefined)
        return () => h('text', { 'data-testid': 'zoom-value' }, String(injectedZoom))
      },
    }))

    expect(wrapper.get('[data-testid="zoom-value"]').text()).toBe('undefined')
  })

  it('provides map zoom context for descendants', () => {
    let injectedZoom: unknown

    mount(defineComponent({
      setup() {
        return () => h(MapBase, {
          fit: sampleGeoJson,
        }, {
          default: () => h(MapZoom, null, {
            default: () => h(defineComponent({
              setup() {
                injectedZoom = inject(mapZoomKey, undefined)
                return () => null
              },
            })),
          }),
        })
      },
    }))

    expect(injectedZoom).toBe(true)
  })

  it('wires zoom behavior and forwards native D3 zoom events', async () => {
    const onZoomStart = vi.fn()
    const onZoom = vi.fn()
    const onZoomEnd = vi.fn()
    const {
      wrapper,
      zoom,
    } = await mountZoom({
      minZoom: 1,
      maxZoom: 6,
      config: { scaleExtent: [[1, 6]] },
      onZoomStart,
      onZoom,
      onZoomEnd,
    })

    expect(zoom.zoomBehavior.scaleExtent()).toEqual([1, 6])

    const transform = zoomIdentity.scale(2)
    const event = {
      sourceEvent: new Event('wheel'),
      transform,
    } as ZoomEvent

    emitZoomEvent(zoom, 'start', event)
    emitZoomEvent(zoom, 'zoom', event)
    emitZoomEvent(zoom, 'end', event)

    expect(onZoomStart).toHaveBeenCalledWith(event)
    expect(onZoom).toHaveBeenCalledWith(event)
    expect(onZoomEnd).toHaveBeenCalledWith(event)
    expect(wrapper.get('[data-testid="map-zoom-group"]').attributes('transform')).toBe(transform.toString())
  })

  it('exposes transform and applies a native D3 zoom transform', async () => {
    const {
      wrapper,
      zoom,
    } = await mountZoom()
    const transform = zoomIdentity.translate(10, 20).scale(3)

    zoom.transform(transform, undefined, false)

    expect(wrapper.get('[data-testid="map-zoom-group"]').attributes('transform')).toBe(transform.toString())
  })

  it('exposes scaleWith and scaleTo through D3 scale helpers', async () => {
    const {
      wrapper,
      zoom,
    } = await mountZoom()

    zoom.scaleWith(0.5, undefined, false)
    expectScale(wrapper.get('[data-testid="map-zoom-group"]').element, 1.5)

    zoom.scaleTo(3, undefined, false)
    expectScale(wrapper.get('[data-testid="map-zoom-group"]').element, 3)
  })

  it('proxies zoom commands through useMapZoom', async () => {
    let commands: ZoomCommands | undefined

    const wrapper = mount(defineComponent({
      setup() {
        const zoomRef = useTemplateRef<MapZoomRef>('zoom')
        commands = useMapZoom(zoomRef)

        return () => h(MapBase, {
          fit: sampleGeoJson,
        }, {
          default: () => h(MapZoom, {
            ref: 'zoom',
            'data-testid': 'map-zoom-group',
          }),
        })
      },
    }))
    await nextTick()

    const transform = zoomIdentity.scale(2.5)
    commands?.transform(transform, undefined, false)

    expect(wrapper.get('[data-testid="map-zoom-group"]').attributes('transform')).toBe(transform.toString())
  })

  it('exposes zoomToFeature and resolves the feature transform through core', async () => {
    const {
      context,
      wrapper,
      zoom,
    } = await mountZoom()
    const feature = sampleGeoJson.features[0]
    const expectedTransform = getFeatureZoomTransform(context, feature, {
      minZoom: 1,
      maxZoom: 8,
      padding: 12,
    })

    expect(expectedTransform).toBeDefined()
    expect(zoom.zoomToFeature(feature, {
      padding: 12,
      transition: false,
    })).toBe(true)
    expect(wrapper.get('[data-testid="map-zoom-group"]').attributes('transform')).toBe(expectedTransform?.toString())
  })

  it('returns false when zoomToFeature cannot resolve a transform', async () => {
    const {
      wrapper,
      zoom,
    } = await mountZoom()

    expect(zoom.zoomToFeature(emptyFeature)).toBe(false)
    expect(wrapper.get('[data-testid="map-zoom-group"]').attributes('transform')).toBeUndefined()
  })

  it('exposes reset and applies the identity transform', async () => {
    const {
      wrapper,
      zoom,
    } = await mountZoom()

    zoom.transform(zoomIdentity.translate(10, 20).scale(3), undefined, false)
    zoom.reset(false)

    expect(wrapper.get('[data-testid="map-zoom-group"]').attributes('transform')).toBe(zoomIdentity.toString())
  })
})

async function mountZoom(props: Record<string, unknown> = {}): Promise<{
  context: MapContext
  wrapper: ReturnType<typeof mount>
  zoom: MapZoomRef
}> {
  let context: MapContext | undefined

  const wrapper = mount(defineComponent({
    render() {
      return h(MapBase, {
        fit: sampleGeoJson,
      }, {
        default: (mapContext: MapContext) => {
          context = mapContext
          return h(MapZoom, {
            ref: 'zoom',
            'data-testid': 'map-zoom-group',
            ...props,
          })
        },
      })
    },
  }))

  await nextTick()

  return {
    context: context as MapContext,
    wrapper,
    zoom: getZoomRef(wrapper),
  }
}

function getZoomRef(wrapper: ReturnType<typeof mount>): MapZoomRef {
  return wrapper.vm.$refs.zoom as MapZoomRef
}

function emitZoomEvent(
  zoom: MapZoomRef,
  type: 'start' | 'zoom' | 'end',
  event: ZoomEvent,
): void {
  const listener = zoom.zoomBehavior.on(type) as ((event: ZoomEvent) => void) | undefined
  listener?.(event)
}

function expectScale(element: Element, scale: number): void {
  const match = element.getAttribute('transform')?.match(/scale\(([^)]+)\)/)
  expect(Number(match?.[1])).toBeCloseTo(scale)
}
