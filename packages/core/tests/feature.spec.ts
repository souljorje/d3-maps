import { describe, expect, it } from 'vitest'

import type { MapFeature } from '../src'

import { getFeatureKey } from '../src'

function makeFeature(): MapFeature {
  return {
    type: 'Feature',
    id: 'feature-id',
    slug: 'direct-key',
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
  const feature = makeFeature()
  it('prefers direct property from feature object', () => {
    expect(getFeatureKey(feature, 'slug', 0)).toBe('direct-key')
  })

  it('falls back to feature.properties', () => {
    expect(getFeatureKey(feature, 'code', 0)).toBe('feature-code')
  })

  it('uses id key by default and falls back to index', () => {
    expect(getFeatureKey(feature, 'id', 4)).toBe('feature-id')
    feature.id = undefined
    expect(getFeatureKey(feature, 'unknown', 4)).toBe(4)
  })
})
