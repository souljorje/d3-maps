import { describe, expect, it } from 'vitest'

import {
  createZoomBehavior,
  createZoomConfig,
  createZoomTransform,
  getDefaultTranslateExtent,
  getInverseZoomScale,
  getZoomScale,
  ZOOM_DEFAULTS,
} from '../src'
import { makeTestMapContext } from './fixtures'

describe('zoom helpers', () => {
  it('returns default translate extent from map context', () => {
    const context = makeTestMapContext()
    expect(getDefaultTranslateExtent(context)).toEqual([[0, 0], [400, 300]])
  })

  it('creates zoom transform from center and scale', () => {
    const transform = createZoomTransform([12, 34], 2)
    expect(transform.x).toBe(12)
    expect(transform.y).toBe(34)
    expect(transform.k).toBe(2)
  })

  it('creates zoom config with configured extents', () => {
    const config = createZoomConfig({
      minZoom: 1,
      maxZoom: 4,
      translateExtent: [[0, 0], [100, 80]],
    })

    expect(config.scaleExtent).toEqual([1, 4])
    expect(config.translateExtent).toEqual([[0, 0], [100, 80]])
  })

  it('creates zoom behavior with configured extents', () => {
    const behavior = createZoomBehavior(undefined, {
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
    const behavior = createZoomBehavior()
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
    const transform = createZoomTransform([0, 0], 3)
    expect(getZoomScale(transform)).toBe(3)
    expect(getZoomScale({ transform })).toBe(3)
    expect(getZoomScale(2)).toBe(2)
  })

  it('applies zoom config to behavior', () => {
    const behavior = createZoomBehavior(undefined, {
      config: {
        clickDistance: 8,
        duration: 250,
      },
    })

    expect(behavior.clickDistance()).toBe(8)
    expect(behavior.duration()).toBe(250)
  })

  it('lets config override overlapping props', () => {
    const behavior = createZoomBehavior(undefined, {
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
    const transform = createZoomTransform([0, 0], 2)
    expect(getInverseZoomScale(transform)).toBe(0.5)
    expect(getInverseZoomScale(4)).toBe(0.25)
    expect(getInverseZoomScale(0, 1)).toBe(1)
  })
})
