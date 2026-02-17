import { describe, expect, it } from 'vitest'
import {
  isTopology,
  makeFeatures,
  makeMapContext,
  makeProjection,
} from '../src'
import { sampleGeoJson } from './fixtures'

describe('makeProjection', () => {
  it('applies projection config', () => {
    const projection = makeProjection({
      width: 100,
      height: 100,
      config: { scale: 200, center: [20, 10], rotate: [0, 0, 10] },
    })

    expect(Math.round(projection.scale())).toBe(200)
    expect(projection.center()).toEqual([20, 10])
    expect(projection.rotate()).toEqual([0, 0, 10])
  })
})

describe('makeFeatures', () => {
  it('returns features from geojson and runs transformer', () => {
    const [features, geoJson] = makeFeatures(sampleGeoJson, (items) => items.slice(0, 1))

    expect(features).toHaveLength(1)
    expect(geoJson.features[0].properties?.id).toBe('demo')
  })
})

describe('makeMapContext', () => {
  it('produces context with path generator', () => {
    const context = makeMapContext({
      width: 400,
      height: 300,
      data: sampleGeoJson,
    })

    expect(context.width).toBe(400)
    expect(context.height).toBe(300)
    expect(context.features).toHaveLength(1)
    expect(typeof context.path(context.features[0])).toBe('string')
  })
})

describe('isTopology', () => {
  it('returns false for geojson input', () => {
    expect(isTopology(sampleGeoJson)).toBe(false)
  })
})
