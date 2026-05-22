import { describe, expect, expectTypeOf, it } from 'vitest'

import type {
  MapFeatureExtension,
  MapFeatureRendered,
} from '../src'

import {
  geoNaturalEarth1,
  geoPath,
} from 'd3-geo'

import {
  getFeatureKey,
  isFeature,
  makeMapFeatures,
  makeProjection,
} from '../src'
import {
  sampleGeoJson,
  sampleGeoJsonTwoFeatures,
  samplePolygon,
  sampleTopologyObjectKey,
  sampleTopologyTwoObjects,
} from './fixtures'

const PROJECTION_BASE = {
  width: 100,
  height: 100,
  projection: geoNaturalEarth1,
}

function makeProjectionFromBase() {
  return makeProjection(PROJECTION_BASE)
}

describe('makeMapFeatures', () => {
  it('enriches normalized features with keys and paths', () => {
    const projection = makeProjectionFromBase()
    const objects = makeMapFeatures({
      path: geoPath().projection(projection),
    }, {
      data: sampleGeoJsonTwoFeatures,
    })

    expect(objects).toHaveLength(2)
    expect(objects[0]?.key).toBe('demo')
    expect(typeof objects[0]?.d).toBe('string')
  })

  it('uses the custom key accessor when provided', () => {
    const projection = makeProjectionFromBase()
    const objects = makeMapFeatures({
      path: geoPath().projection(projection),
    }, {
      data: sampleGeoJsonTwoFeatures,
      getKey: (item, index) => isFeature(item)
        ? item.properties?.id ?? `custom-${index}`
        : undefined,
    })

    expect(objects.map(({ key }) => key)).toEqual(['demo', 'demo-2'])
  })

  it('applies feature transformers after data normalization', () => {
    const projection = makeProjectionFromBase()
    const features = makeMapFeatures({
      path: geoPath().projection(projection),
    }, {
      data: sampleTopologyTwoObjects,
      objectKey: sampleTopologyObjectKey,
      transformer: (items) => items.slice(0, 1),
    })

    expect(features).toHaveLength(1)
  })

  it('keeps transformer enrichment in rendered feature types', () => {
    type NamedFeature = MapFeatureExtension<{
      color: string
    }>

    const projection = makeProjectionFromBase()
    const objects = makeMapFeatures({
      path: geoPath().projection(projection),
    }, {
      data: sampleGeoJsonTwoFeatures,
      transformer: (features): NamedFeature[] => features.map((feature) => ({
        ...feature,
        color: 'darkorange',
      })),
      getKey: (feature) => feature.color,
    })

    expectTypeOf(objects).toEqualTypeOf<MapFeatureRendered<NamedFeature>[]>()
    expect(objects[0]?.color).toBe('darkorange')
  })
})

describe('getFeatureKey', () => {
  it('prefers item id, then properties.id, then properties.name, then index', () => {
    expect(getFeatureKey(sampleGeoJson.features[0], 9)).toBe('demo')
    expect(getFeatureKey({
      ...sampleGeoJson.features[0],
      id: undefined,
    }, 9)).toBe('demo')
    expect(getFeatureKey({
      ...sampleGeoJson.features[0],
      id: undefined,
      properties: { name: 'named-feature' },
    }, 9)).toBe('named-feature')
    expect(getFeatureKey(samplePolygon, 9)).toBe(9)
  })
})
