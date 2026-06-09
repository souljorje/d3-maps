import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import type {
  ZoomBehaviorOptions,
  ZoomCommands,
  ZoomEvent,
  ZoomTransform,
} from '@d3-maps/core'

import type {
  MapZoomRef,
} from '../src/hooks/useMapZoom'

import { mount } from '@vue/test-utils'
import {
  defineComponent,
  h,
  inject,
  useTemplateRef,
} from 'vue'

import {
  MapBase,
  MapZoom,
} from '../src'
import { mapZoomKey } from '../src/hooks/useCreateMapZoom'
import {
  useMapZoom,
} from '../src/hooks/useMapZoom'
import { sampleGeoJson } from './fixtures'

const setupZoomSpy = vi.hoisted(() => vi.fn())
const applyZoomTransformSpy = vi.hoisted(() => vi.fn((_: ApplyZoomTransformOptions) => true))
const getFeatureZoomTransformSpy = vi.hoisted(() => vi.fn((..._: unknown[]) => undefined as unknown))
const scaleToSpy = vi.hoisted(() => vi.fn((_: ScaleToOptions) => true))
let zoomBehaviorOptions: ZoomBehaviorOptions | undefined

interface ApplyZoomTransformOptions {
  element: SVGElement | null | undefined
  behavior: unknown
  transform: ZoomTransform | unknown
  point?: unknown
  transition?: false | unknown
}

interface ScaleToOptions {
  element: SVGElement | null | undefined
  behavior: unknown
  scale: number
  point?: unknown
  transition?: false | unknown
}

type TestCommandTransition = false | undefined

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
    createZoomCommands: (options: Parameters<typeof actual.createZoomCommands>[0]) => ({
      transform: (
        transform: ApplyZoomTransformOptions['transform'],
        point?: ApplyZoomTransformOptions['point'],
        transition?: TestCommandTransition,
      ) => {
        return applyZoomTransformSpy({
          element: options.element(),
          behavior: options.behavior(),
          transform,
          point,
          transition: transition ?? options.transition?.(),
        })
      },
      translateBy: vi.fn(() => true),
      translateTo: vi.fn(() => true),
      scaleBy: vi.fn(() => true),
      scaleTo: (
        scale: number,
        point?: [number, number],
        transition?: TestCommandTransition,
      ) => {
        return scaleToSpy({
          element: options.element(),
          behavior: options.behavior(),
          scale,
          point,
          transition: transition ?? options.transition?.(),
        })
      },
      scaleWith: (
        delta: number,
        point?: [number, number],
        transition?: TestCommandTransition,
      ) => {
        return scaleToSpy({
          element: options.element(),
          behavior: options.behavior(),
          scale: 1 + delta,
          point,
          transition: transition ?? options.transition?.(),
        })
      },
      zoomToFeature: (
        feature: unknown,
        commandOptions: { padding?: number, transition?: false | unknown } = {},
      ) => {
        const transform = getFeatureZoomTransformSpy(options.context(), feature, {
          minZoom: options.minZoom(),
          maxZoom: options.maxZoom(),
          padding: commandOptions.padding,
        })
        if (!transform) return false
        return applyZoomTransformSpy({
          element: options.element(),
          behavior: options.behavior(),
          transform,
          transition: commandOptions.transition ?? options.transition?.(),
        })
      },
      reset: (transition?: TestCommandTransition) => applyZoomTransformSpy({
        element: options.element(),
        behavior: options.behavior(),
        transform: actual.zoomIdentity,
        transition: transition ?? options.transition?.(),
      }),
    }),
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

    expect(injectedZoom).toBe(true)
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

  it('exposes transform and applies a native D3 zoom transform', async () => {
    const wrapper = mountZoom()
    await Promise.resolve()

    const commands = getZoomCommands(wrapper)
    const transform = createTransform(3)

    commands.transform(transform, undefined, false)
    expect(applyZoomTransformSpy).toHaveBeenCalledWith(expect.objectContaining({
      element: expect.any(SVGElement),
      transform,
      transition: false,
    }))
  })

  it('exposes scaleWith and scaleTo through D3 scale helpers', async () => {
    const wrapper = mountZoom()
    await Promise.resolve()

    const commands = getZoomCommands(wrapper)

    commands.scaleWith(0.5, undefined, false)
    commands.scaleTo(3, undefined, false)
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

  it('proxies zoom commands through useMapZoom', async () => {
    let commands: ZoomCommands | undefined

    mount(defineComponent({
      setup() {
        const zoomRef = useTemplateRef<MapZoomRef>('zoom')
        commands = useMapZoom(zoomRef)

        return () => h(MapBase, {
          data: sampleGeoJson,
        }, {
          default: () => h(MapZoom, { ref: 'zoom' }),
        })
      },
    }))
    await Promise.resolve()

    commands?.scaleWith(0.5, undefined, false)
    commands?.scaleTo(3, undefined, false)
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
      padding: 12,
      transition: false,
    })).toBe(true)

    expect(getFeatureZoomTransformSpy).toHaveBeenCalledWith(
      expect.any(Object),
      feature,
      expect.objectContaining({
        maxZoom: 8,
        minZoom: 1,
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

    commands.reset(false)
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
        default: () => h(MapZoom, { ref: 'zoom' }),
      })
    },
  }))
}

function getZoomCommands(wrapper: ReturnType<typeof mountZoom>): ZoomCommands {
  return wrapper.vm.$refs.zoom as unknown as ZoomCommands
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
