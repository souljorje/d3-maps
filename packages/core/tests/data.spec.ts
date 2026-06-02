import { describe, expect, it } from 'vitest'

import {
  isFeature,
  isTopology,
  resolveMapData,
} from '../src'
import {
  sampleGeoJson,
  sampleGeoJsonTwoFeatures,
  sampleGeometryCollection,
  sampleGeometryCollectionFeature,
  samplePolygon,
  sampleTopology,
  sampleTopologyObjectKey,
  sampleTopologyTwoObjects,
} from './fixtures'

describe('map data', () => {
  it('resolves features and geometries into renderable units', () => {
    expect(resolveMapData(sampleGeoJsonTwoFeatures)).toHaveLength(2)
    expect(resolveMapData(sampleTopology)).toHaveLength(1)
    expect(resolveMapData(sampleTopologyTwoObjects, sampleTopologyObjectKey)).toHaveLength(2)
    expect(resolveMapData(sampleGeoJson)).toHaveLength(1)
    expect(resolveMapData(sampleGeometryCollection)).toHaveLength(2)
    expect(resolveMapData(samplePolygon)).toHaveLength(1)
  })

  it('preserves feature geometry collections as single feature objects', () => {
    expect(resolveMapData(sampleGeometryCollectionFeature)).toEqual([sampleGeometryCollectionFeature])
  })

  it('keeps raw geometry inputs as geometries', () => {
    const [geometry] = resolveMapData(samplePolygon)
    const data = resolveMapData(sampleTopologyTwoObjects, sampleTopologyObjectKey)

    expect(geometry).toBe(samplePolygon)
    expect(data).toHaveLength(2)
    expect(data.every((object) => isFeature(object))).toBe(true)
  })
})

describe('isTopology', () => {
  it('detects topology input', () => {
    expect(isTopology(sampleTopology)).toBe(true)
    expect(isTopology(sampleGeoJson)).toBe(false)
  })
})
