import { describe, expect, it, vi } from 'vitest'

import type { Extent, ZoomBehaviorOptions, ZoomTransform } from '../src'

import { zoomIdentity } from 'd3-zoom'

import {
  createZoomBehavior,

  getInverseZoomScale,
  getZoomScale,
  ZOOM_DEFAULTS,
} from '../src'
import { makeTestMapContext } from './fixtures'

const createBehavior = (options?: ZoomBehaviorOptions) => createZoomBehavior(undefined, options)

type ZoomView = [number, number, number]

describe('zoom helpers', () => {
  it('creates zoom transform from center and scale', () => {
    const transform = zoomIdentity.translate(12, 34).scale(2)
    expect(transform.x).toBe(12)
    expect(transform.y).toBe(34)
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
    const behavior = createBehavior()
    expect(behavior.scaleExtent()).toEqual([
      ZOOM_DEFAULTS.minZoom,
      ZOOM_DEFAULTS.maxZoom,
    ])
    expect(behavior.translateExtent()).toEqual([[0, 0], [0, 0]])
  })

  it('creates zoom behavior with default translate extent from context', () => {
    const context = makeTestMapContext()
    const behavior = createZoomBehavior(context)
    expect(behavior.translateExtent()).toEqual([[0, 0], [400, 300]])
  })

  it('reads zoom scale from different inputs', () => {
    const transform = zoomIdentity.scale(3)
    expect(getZoomScale(transform)).toBe(3)
    expect(getZoomScale({ transform })).toBe(3)
    expect(getZoomScale(2)).toBe(2)
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
        scaleExtent: [[2, 9]],
        translateExtent: [[[0, 0], [10, 10]]],
      },
    })

    expect(behavior.scaleExtent()).toEqual([2, 9])
    expect(behavior.translateExtent()).toEqual([[0, 0], [10, 10]])
  })

  it('computes inverse zoom scale', () => {
    const transform = zoomIdentity.scale(2)
    expect(getInverseZoomScale(transform)).toBe(0.5)
    expect(getInverseZoomScale(4)).toBe(0.25)
    expect(getInverseZoomScale(0, 1)).toBe(1)
  })
})
