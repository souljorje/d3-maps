import { describe, expect, it } from 'vitest'

import type { Feature, Polygon } from 'geojson'

import { getFeatureKey } from '../src'

function makeFeature(): Feature<Polygon> {
  return {
    type: 'Feature',
    id: 'feature-id',
    properties: {
      code: 'feature-code',
    },
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [0, 0],
          [0, 1],
          [1, 1],
          [1, 0],
          [0, 0],
        ],
      ],
    },
  }
}

describe('getFeatureKey', () => {
  it('prefers direct property from feature object', () => {
    const feature = makeFeature() as Feature<Polygon> & Record<string, unknown>
    feature.slug = 'direct-key'

    expect(getFeatureKey(feature, 'slug', 0)).toBe('direct-key')
  })

  it('falls back to feature.properties', () => {
    const feature = makeFeature() as Feature<Polygon> & Record<string, unknown>
    expect(getFeatureKey(feature, 'code', 0)).toBe('feature-code')
  })

  it('uses id key by default and falls back to index', () => {
    const feature = makeFeature() as Feature<Polygon> & Record<string, unknown>
    expect(getFeatureKey(feature, 'id', 4)).toBe('feature-id')

    feature.id = undefined
    expect(getFeatureKey(feature, 'unknown', 4)).toBe(4)
  })
})
