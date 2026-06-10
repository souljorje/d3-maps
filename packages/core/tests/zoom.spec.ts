import { describe, expect, it, vi } from 'vitest'

import type { ZoomBehaviorOptions, ZoomTransform } from '../src'

import { zoomIdentity } from 'd3-zoom'

import {
  applyZoomEventTransform,
  createZoomBehavior,
  createZoomCommands,
  createZoomCommandsProxy,
  getFeatureZoomTransform,
  getInverseZoomScale,
  getZoomScale,
  getZoomViewportCenter,
  isProgrammaticZoomEvent,
  ZOOM_DEFAULTS,
} from '../src'
import {
  makeTestMapContext,
  sampleGeoJson,
} from './fixtures'

const createBehavior = (options?: ZoomBehaviorOptions) => createZoomBehavior(undefined, options)

type ZoomView = [number, number, number]
type Extent = [[number, number], [number, number]]

describe('zoom helpers', () => {
  it('creates zoom transform from center and scale', () => {
    const transform = zoomIdentity.translate(100, 50).scale(2)
    expect(transform.x).toBe(100)
    expect(transform.y).toBe(50)
    expect(transform.k).toBe(2)
  })

  it('creates zoom behavior with configured extents', () => {
    const behavior = createBehavior({
      minZoom: 1,
      maxZoom: 4,
      config: {
        translateExtent: [[[0, 0], [120, 90]]],
      },
    })

    expect(behavior.scaleExtent()).toEqual([1, 4])
    expect(behavior.translateExtent()).toEqual([[0, 0], [120, 90]])
  })

  it('creates zoom behavior with default options', () => {
    class FakeSVGElement {
      hasAttribute() {
        return false
      }

      height = { baseVal: { value: 0 } }
      width = { baseVal: { value: 0 } }
    }

    vi.stubGlobal('SVGElement', FakeSVGElement)

    try {
      const behavior = createBehavior()
      expect(behavior.scaleExtent()).toEqual([
        ZOOM_DEFAULTS.minZoom,
        ZOOM_DEFAULTS.maxZoom,
      ])
      expect(behavior.extent().call(
        new FakeSVGElement() as unknown as SVGSVGElement,
        {} as any,
      )).toEqual([[0, 0], [0, 0]])
      expect(behavior.translateExtent()).toEqual([[-Infinity, -Infinity], [Infinity, Infinity]])
    } finally {
      vi.unstubAllGlobals()
    }
  })

  it('creates zoom behavior with default viewport extents from context', () => {
    const context = makeTestMapContext()
    const behavior = createZoomBehavior(context)
    expect(behavior.extent().call({} as SVGSVGElement, {} as any)).toEqual([[0, 0], [400, 300]])
    expect(behavior.translateExtent()).toEqual([[0, 0], [400, 300]])
  })

  it('reads zoom scale from different inputs', () => {
    const transform = zoomIdentity.scale(3)
    expect(getZoomScale(transform)).toBe(3)
    expect(getZoomScale({ transform })).toBe(3)
    expect(getZoomScale(2)).toBe(2)
  })

  it('gets the viewport center point from a zoom transform', () => {
    const center = getZoomViewportCenter({
      width: 400,
      height: 300,
    }, {
      invert: ([x, y]) => [x - 10, y + 5],
    } as ZoomTransform)

    expect(center).toEqual([190, 155])
  })

  it('detects programmatic zoom events from native D3 event shape', () => {
    expect(isProgrammaticZoomEvent({
      sourceEvent: null,
    } as any)).toBe(true)
    expect(isProgrammaticZoomEvent({
      sourceEvent: new Event('wheel'),
    } as any)).toBe(false)
  })

  it('applies a zoom event transform to a group element', () => {
    const setAttribute = vi.fn()

    applyZoomEventTransform({
      setAttribute,
    } as unknown as Element, {
      transform: {
        toString: () => 'translate(7,8) scale(9)',
      },
    } as any)

    expect(setAttribute).toHaveBeenCalledWith('transform', 'translate(7,8) scale(9)')
  })

  it('applies full zoom config', () => {
    const filter = vi.fn(() => true)
    const wheelDelta = vi.fn(() => 1)
    const constrain = vi.fn((transform: ZoomTransform, _extent: Extent, _translateExtent: Extent) => transform)
    const interpolate = vi.fn((a: ZoomView, _b: ZoomView) => (_t: number) => a)
    const behavior = createBehavior({
      config: {
        clickDistance: 8,
        duration: 250,
        tapDistance: 12,
        filter,
        wheelDelta,
        constrain,
        interpolate,
        extent: [[[0, 0], [10, 20]]],
        touchable: false,
        scaleExtent: [[2, 9]],
        translateExtent: [[[5, 6], [70, 80]]],
      },
    })

    expect(behavior.clickDistance()).toBe(8)
    expect(behavior.duration()).toBe(250)
    expect(behavior.tapDistance()).toBe(12)
    expect(behavior.filter()).toBe(filter)
    expect(behavior.wheelDelta()).toBe(wheelDelta)
    expect(behavior.constrain()).toBe(constrain)
    expect(behavior.interpolate()).toBe(interpolate)

    const extentFn = behavior.extent()
    expect(typeof extentFn).toBe('function')
    expect(extentFn.call({} as SVGSVGElement, {} as any)).toEqual([[0, 0], [10, 20]])

    const touchableFn = behavior.touchable()
    expect(typeof touchableFn).toBe('function')
    expect(touchableFn.call({} as SVGSVGElement, {} as any, 0, [])).toBe(false)

    expect(behavior.scaleExtent()).toEqual([2, 9])
    expect(behavior.translateExtent()).toEqual([[5, 6], [70, 80]])
  })

  it('lets config override overlapping props', () => {
    const behavior = createBehavior({
      minZoom: 1,
      maxZoom: 4,
      config: {
        extent: [[[1, 2], [30, 40]]],
        scaleExtent: [[2, 9]],
        translateExtent: [[[0, 0], [10, 10]]],
      },
    })

    expect(behavior.extent().call({} as SVGSVGElement, {} as any)).toEqual([[1, 2], [30, 40]])
    expect(behavior.scaleExtent()).toEqual([2, 9])
    expect(behavior.translateExtent()).toEqual([[0, 0], [10, 10]])
  })

  it('computes inverse zoom scale', () => {
    const transform = zoomIdentity.scale(2)
    expect(getInverseZoomScale(transform)).toBe(0.5)
    expect(getInverseZoomScale(4)).toBe(0.25)
    expect(getInverseZoomScale(0, 1)).toBe(1)
  })

  it('ignores zoom commands when the target element is missing', () => {
    const transformCall = vi.fn()
    class FakeSVGElement {}

    vi.stubGlobal('SVGSVGElement', FakeSVGElement)
    const svgElement = new FakeSVGElement() as unknown as SVGSVGElement
    const transform = zoomIdentity.translate(10, 20).scale(2)
    const commands = createZoomCommands({
      element: () => svgElement,
      behavior: () => ({
        transform: transformCall,
      }) as any,
      context: () => makeTestMapContext(),
      minZoom: () => 1,
      maxZoom: () => 8,
    })
    const missingElementCommands = createZoomCommands({
      element: () => null,
      behavior: () => ({
        transform: transformCall,
      }) as any,
      context: () => makeTestMapContext(),
      minZoom: () => 1,
      maxZoom: () => 8,
    })

    missingElementCommands.transform(transform)
    expect(transformCall).not.toHaveBeenCalled()

    commands.transform(transform)
    expect(transformCall).toHaveBeenCalledWith(expect.anything(), transform, undefined)

    vi.unstubAllGlobals()
  })

  it('applies native zoom methods through D3 zoom', () => {
    const transformSpy = vi.fn()
    const translateBySpy = vi.fn()
    const translateToSpy = vi.fn()
    const scaleBySpy = vi.fn()
    const scaleToSpy = vi.fn()
    class FakeSVGElement {}

    vi.stubGlobal('SVGSVGElement', FakeSVGElement)
    const svgElement = new FakeSVGElement() as unknown as SVGSVGElement
    const transform = zoomIdentity.translate(10, 20).scale(2)
    const point: [number, number] = [40, 50]
    const commands = createZoomCommands({
      element: () => svgElement,
      behavior: () => ({
        scaleBy: scaleBySpy,
        scaleTo: scaleToSpy,
        transform: transformSpy,
        translateBy: translateBySpy,
        translateTo: translateToSpy,
      }) as any,
      context: () => makeTestMapContext(),
      minZoom: () => 1,
      maxZoom: () => 8,
    })

    commands.transform(transform, undefined, point)
    expect(transformSpy).toHaveBeenCalledWith(expect.anything(), transform, point)

    commands.translateBy(4, 5)
    expect(translateBySpy).toHaveBeenCalledWith(expect.anything(), 4, 5)

    commands.translateTo(4, 5, undefined, point)
    expect(translateToSpy).toHaveBeenCalledWith(expect.anything(), 4, 5, point)

    commands.scaleBy(1.5, undefined, point)
    expect(scaleBySpy).toHaveBeenCalledWith(expect.anything(), 1.5, point)

    commands.scaleTo(3, undefined, point)
    expect(scaleToSpy).toHaveBeenCalledWith(expect.anything(), 3, point)

    vi.unstubAllGlobals()
  })

  it('applies additive scale through scaleWith', () => {
    const scaleToSpy = vi.fn()
    class FakeSVGElement {}

    vi.stubGlobal('SVGSVGElement', FakeSVGElement)
    const svgElement = new FakeSVGElement() as unknown as SVGSVGElement
    const commands = createZoomCommands({
      element: () => svgElement,
      behavior: () => ({
        scaleTo: scaleToSpy,
      }) as any,
      context: () => makeTestMapContext(),
      minZoom: () => 1,
      maxZoom: () => 8,
    })

    commands.scaleWith(0.5)
    expect(scaleToSpy).toHaveBeenCalledWith(expect.anything(), 1.5, undefined)

    const pointFn = (): [number, number] => [40, 50]
    commands.scaleWith(0.5, undefined, pointFn)
    expect(scaleToSpy).toHaveBeenLastCalledWith(expect.anything(), 1.5, pointFn)

    vi.unstubAllGlobals()
  })

  it('clamps additive scale through scaleWith', () => {
    const scaleToSpy = vi.fn()
    class FakeSVGElement {}

    vi.stubGlobal('SVGSVGElement', FakeSVGElement)
    const svgElement = new FakeSVGElement() as unknown as SVGSVGElement
    const commands = createZoomCommands({
      element: () => svgElement,
      behavior: () => ({
        scaleTo: scaleToSpy,
      }) as any,
      context: () => makeTestMapContext(),
      minZoom: () => 1,
      maxZoom: () => 1.25,
    })

    commands.scaleWith(0.5)
    expect(scaleToSpy).toHaveBeenCalledWith(expect.anything(), 1.25, undefined)

    commands.scaleWith(-0.5)
    expect(scaleToSpy).toHaveBeenLastCalledWith(expect.anything(), 1, undefined)

    vi.unstubAllGlobals()
  })

  it('creates zoom commands from lazy element and behavior accessors', () => {
    const transformSpy = vi.fn()
    const scaleToSpy = vi.fn()
    class FakeSVGElement {}

    vi.stubGlobal('SVGSVGElement', FakeSVGElement)
    const svgElement = new FakeSVGElement() as unknown as SVGSVGElement
    const commands = createZoomCommands({
      element: () => svgElement,
      behavior: () => ({
        scaleTo: scaleToSpy,
        transform: transformSpy,
      }) as any,
      context: () => makeTestMapContext(),
      minZoom: () => 1,
      maxZoom: () => 8,
    })

    commands.reset(false)
    expect(transformSpy).toHaveBeenCalledWith(expect.anything(), zoomIdentity)
    commands.scaleTo(3, false)
    expect(scaleToSpy).toHaveBeenCalledWith(expect.anything(), 3, undefined)

    vi.unstubAllGlobals()
  })

  it('computes a feature zoom transform', () => {
    const context = makeTestMapContext()
    const feature = sampleGeoJson.features[0]
    const [[x0, y0], [x1, y1]] = context.path.bounds(feature)
    const boundsWidth = x1 - x0
    const boundsHeight = y1 - y0
    const zoom = Math.min(
      4,
      Math.max(
        2,
        Math.min(
          (context.width - 20) / boundsWidth,
          (context.height - 20) / boundsHeight,
        ),
      ),
    )

    const transform = getFeatureZoomTransform(context, feature, {
      minZoom: 2,
      maxZoom: 4,
      padding: 10,
    })

    expect(transform).toBeDefined()
    expect(transform?.k).toBeCloseTo(zoom)
    expect(transform?.x).toBeCloseTo(context.width / 2 - zoom * ((x0 + x1) / 2))
    expect(transform?.y).toBeCloseTo(context.height / 2 - zoom * ((y0 + y1) / 2))
  })

  it('returns undefined for empty feature zoom bounds', () => {
    const context = {
      width: 400,
      height: 300,
      path: {
        bounds: () => [[0, 0], [0, 0]],
      },
    }

    expect(getFeatureZoomTransform(context as any, {} as any)).toBeUndefined()
  })

  it('applies a computed feature zoom transform through commands', () => {
    const context = makeTestMapContext()
    const svgElement = new (class FakeSVGElement {})() as unknown as SVGSVGElement
    const transformCall = vi.fn()
    const feature = sampleGeoJson.features[0]
    const transform = getFeatureZoomTransform(context, feature, {
      padding: 10,
    })
    const commands = createZoomCommands({
      element: () => svgElement,
      behavior: () => ({
        transform: transformCall,
      }) as any,
      context: () => context,
      minZoom: () => 1,
      maxZoom: () => 8,
    })

    vi.stubGlobal('SVGSVGElement', svgElement.constructor as any)

    expect(transform).toBeDefined()
    expect(commands.zoomToFeature(feature, 10)).toBe(true)
    expect(transformCall).toHaveBeenCalledWith(expect.anything(), transform)

    vi.unstubAllGlobals()
  })

  it('creates a command proxy from a target getter', () => {
    const transform = vi.fn()
    const reset = vi.fn()
    const zoomToFeature = vi.fn(() => true)
    const commands = createZoomCommandsProxy(() => ({
      transform,
      translateBy: vi.fn(),
      translateTo: vi.fn(),
      scaleBy: vi.fn(),
      scaleTo: vi.fn(),
      scaleWith: vi.fn(),
      zoomToFeature,
      reset,
    }))

    commands.transform(zoomIdentity, false)
    commands.reset(false)
    expect(commands.zoomToFeature(sampleGeoJson.features[0])).toBe(true)

    expect(transform).toHaveBeenCalledWith(zoomIdentity, false)
    expect(reset).toHaveBeenCalledWith(false)
    expect(zoomToFeature).toHaveBeenCalledWith(sampleGeoJson.features[0])
  })
})
