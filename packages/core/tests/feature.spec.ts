import { describe, expect, expectTypeOf, it } from 'vitest'

import type { MapFeatureRendered } from '../src'

import {
  geoNaturalEarth1,
  geoPath,
} from 'd3-geo'

import {
  getFeatureKey,
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
      getKey: (item, index) => String(item.properties.id ?? `custom-${index}`),
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
    interface NamedFeatureExtra {
      color: string
    }

    const projection = makeProjectionFromBase()
    const objects = makeMapFeatures({
      path: geoPath().projection(projection),
    }, {
      data: sampleGeoJsonTwoFeatures,
      transformer: (features) => features.map((feature) => ({
        ...feature,
        color: 'darkorange',
      })),
      getKey: (feature) => feature.color,
    })

    expectTypeOf(objects).toEqualTypeOf<MapFeatureRendered<NamedFeatureExtra>[]>()
    expect(objects[0]?.color).toBe('darkorange')
  })

  it('supports filtering in feature transformers', () => {
    const projection = makeProjectionFromBase()
    const objects = makeMapFeatures({
      path: geoPath().projection(projection),
    }, {
      data: sampleGeoJsonTwoFeatures,
      transformer: (features) => features.filter((feature) => feature.properties.id !== 'demo-2'),
    })

    expect(objects).toHaveLength(1)
    expect(objects[0]?.properties.id).toBe('demo')
  })

  it('preserves null-geometry features without path data', () => {
    const projection = makeProjectionFromBase()
    const objects = makeMapFeatures({
      path: geoPath().projection(projection),
    }, {
      data: {
        type: 'Feature',
        geometry: null,
        properties: { id: 'empty' },
      },
    })

    expect(objects).toHaveLength(1)
    expect(objects[0]?.geometry).toBeNull()
    expect(objects[0]?.key).toBe('empty')
    expect(objects[0]?.d).toBeUndefined()
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
