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

import type { MapZoomCommands } from '../src/hooks/useMapZoom'

import { mount } from '@vue/test-utils'
import {
  defineComponent,
  h,
  inject,
} from 'vue'

import {
  MapBase,
  MapZoom,
} from '../src'
import { mapZoomKey } from '../src/hooks/useMapZoom'
import { sampleGeoJson } from './fixtures'

const setupZoomSpy = vi.hoisted(() => vi.fn())
const applyZoomTransformSpy = vi.hoisted(() => vi.fn(() => true))
const getFeatureZoomTransformSpy = vi.hoisted(() => vi.fn())
const scaleToSpy = vi.hoisted(() => vi.fn(() => true))
let zoomBehaviorOptions: ZoomBehaviorOptions | undefined

interface ApplyZoomTransformOptions {
  element: SVGElement | null | undefined
  behavior: unknown
  transform: ZoomTransform
  transition?: false | unknown
}

interface ScaleToOptions {
  element: SVGElement | null | undefined
  behavior: unknown
  scale: number
  transition?: false | unknown
}

function createZoomEvent(
  zoom: number,
  sourceEvent: Event | null = null,
): ZoomEvent {
  return ({
    sourceEvent,
    transform: createTransform(zoom),
  }) as unknown as ZoomEvent
}

vi.mock('@d3-maps/core', async () => {
  const actual = await vi.importActual<typeof import('@d3-maps/core')>('@d3-maps/core')

  return {
    ...actual,
    setupZoom: (...args: Parameters<typeof actual.setupZoom>) => {
      setupZoomSpy(...args)
    },
    applyZoomTransform: (options: ApplyZoomTransformOptions) => {
      return applyZoomTransformSpy(options)
    },
    scaleTo: (options: ScaleToOptions) => {
      return scaleToSpy(options)
    },
    getFeatureZoomTransform: (
      context: unknown,
      feature: unknown,
      options: unknown,
    ) => getFeatureZoomTransformSpy(context, feature, options),
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
    applyZoomTransformSpy.mockClear()
    applyZoomTransformSpy.mockReturnValue(true)
    getFeatureZoomTransformSpy.mockClear()
    getFeatureZoomTransformSpy.mockReturnValue(undefined)
    scaleToSpy.mockClear()
    scaleToSpy.mockReturnValue(true)
    zoomBehaviorOptions = undefined
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
          data: sampleGeoJson,
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

    expect(injectedZoom).toBeTruthy()
  })

  it('wires zoom setup and forwards native D3 zoom events', async () => {
    const onZoomStart = vi.fn()
    const onZoom = vi.fn()
    const onZoomEnd = vi.fn()

    const wrapper = mount(defineComponent({
      render() {
        return h(MapBase, {
          data: sampleGeoJson,
        }, {
          default: () => h(MapZoom, {
            'data-testid': 'map-zoom-group',
            minZoom: 1,
            maxZoom: 6,
            config: { scaleExtent: [[1, 6]] },
            onZoomStart,
            onZoom,
            onZoomEnd,
          }, {
            default: () => h('g', { 'data-testid': 'zoom-content' }),
          }),
        })
      },
    }))

    await Promise.resolve()

    expect(setupZoomSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        behavior: expect.any(Object),
        element: expect.any(SVGElement),
      }),
    )
    expect(zoomBehaviorOptions?.config).toEqual({ scaleExtent: [[1, 6]] })

    const event = createZoomEvent(2, new Event('wheel'))
    zoomBehaviorOptions?.onZoomStart?.(event)
    zoomBehaviorOptions?.onZoom?.(event)
    zoomBehaviorOptions?.onZoomEnd?.(event)

    expect(onZoomStart).toHaveBeenCalledWith(event)
    expect(onZoom).toHaveBeenCalledWith(event)
    expect(onZoomEnd).toHaveBeenCalledWith(event)
    expect(wrapper.get('[data-testid="map-zoom-group"]').attributes('transform')).toContain('translate')
  })

  it('exposes zoomTo and applies a native D3 zoom transform', async () => {
    const wrapper = mountZoom()
    await Promise.resolve()

    const commands = getZoomCommands(wrapper)
    const transform = createTransform(3)

    expect(commands.zoomTo(transform, { transition: false })).toBe(true)
    expect(applyZoomTransformSpy).toHaveBeenCalledWith(expect.objectContaining({
      element: expect.any(SVGElement),
      transform,
      transition: false,
    }))
  })

  it('exposes zoomBy and zoomToScale through D3 scale helpers', async () => {
    const wrapper = mountZoom()
    await Promise.resolve()

    const commands = getZoomCommands(wrapper)

    expect(commands.zoomBy(0.5, { transition: false })).toBe(true)
    expect(commands.zoomToScale(3, { transition: false })).toBe(true)
    expect(scaleToSpy).toHaveBeenCalledWith(expect.objectContaining({
      element: expect.any(SVGElement),
      scale: 1.5,
      transition: false,
    }))
    expect(scaleToSpy).toHaveBeenCalledWith(expect.objectContaining({
      scale: 3,
      transition: false,
    }))
  })

  it('exposes zoomToFeature and resolves the feature transform through core', async () => {
    const wrapper = mountZoom()
    await Promise.resolve()

    const commands = getZoomCommands(wrapper)
    const feature = sampleGeoJson.features[0]
    const transform = createTransform(4)
    getFeatureZoomTransformSpy.mockReturnValue(transform)

    expect(commands.zoomToFeature(feature, {
      minZoom: 2,
      padding: 12,
      transition: false,
    })).toBe(true)

    expect(getFeatureZoomTransformSpy).toHaveBeenCalledWith(
      expect.any(Object),
      feature,
      expect.objectContaining({
        maxZoom: 8,
        minZoom: 2,
        padding: 12,
      }),
    )
    expect(applyZoomTransformSpy).toHaveBeenCalledWith(expect.objectContaining({
      transform,
      transition: false,
    }))
  })

  it('returns false when zoomToFeature cannot resolve a transform', async () => {
    const wrapper = mountZoom()
    await Promise.resolve()

    const commands = getZoomCommands(wrapper)

    expect(commands.zoomToFeature(sampleGeoJson.features[0])).toBe(false)
    expect(applyZoomTransformSpy).not.toHaveBeenCalled()
  })

  it('exposes reset and applies the identity transform', async () => {
    const wrapper = mountZoom()
    await Promise.resolve()

    const commands = getZoomCommands(wrapper)

    expect(commands.reset({ transition: false })).toBe(true)
    expect(applyZoomTransformSpy).toHaveBeenCalledWith(expect.objectContaining({
      transform: expect.objectContaining({
        k: 1,
        x: 0,
        y: 0,
      }),
      transition: false,
    }))
  })
})

function mountZoom() {
  return mount(defineComponent({
    render() {
      return h(MapBase, {
        data: sampleGeoJson,
      }, {
        default: () => h(MapZoom),
      })
    },
  }))
}

function getZoomCommands(wrapper: ReturnType<typeof mountZoom>): MapZoomCommands {
  return wrapper.findComponent(MapZoom).vm as unknown as MapZoomCommands
}

function createTransform(zoom: number): ZoomTransform {
  return {
    k: zoom,
    x: 0,
    y: 0,
    invert: () => [200, 150],
    toString: () => `translate(0,0) scale(${zoom})`,
  } as unknown as ZoomTransform
}
