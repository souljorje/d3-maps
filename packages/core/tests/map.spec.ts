import { describe, expect, expectTypeOf, it } from 'vitest'

import type { GeoPermissibleObjects } from 'd3-geo'

import { geoNaturalEarth1 } from 'd3-geo'

import {
  getTopoObject,
  isTopology,
  makeFeatures,
  makeMapContext,
  makeMesh,
  makeProjection,
} from '../src'
import {
  sampleGeoJson,
  sampleTopology,
  sampleTopologyTwoObjects,
} from './fixtures'

const sphereGeoJson = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: { type: 'Sphere' },
      properties: {},
    },
  ],
} satisfies GeoPermissibleObjects

const PROJECTION_BASE = {
  width: 100,
  height: 100,
  projection: geoNaturalEarth1,
}

function makeProjectionFromBase(overrides: Partial<Parameters<typeof makeProjection>[0]> = {}) {
  return makeProjection({
    ...PROJECTION_BASE,
    ...overrides,
  })
}

describe('makeProjection', () => {
  it('creates projection', () => {
    const projection = makeProjectionFromBase()
    expectTypeOf(projection).toEqualTypeOf(geoNaturalEarth1())
  })

  it('applies full projection config', () => {
    const projection = makeProjectionFromBase({
      config: {
        angle: 12,
        scale: 200,
        center: [[20, 10]],
        rotate: [[0, 0, 10]],
        translate: [[30, 40]],
        clipAngle: 90,
        clipExtent: [[[0, 0], [90, 80]]],
        precision: 0.5,
        reflectX: true,
        reflectY: true,
      },
    })

    expect(projection.angle()).toBeCloseTo(12)
    expect(Math.round(projection.scale())).toBe(200)
    expect(projection.center()).toEqual([20, 10])
    expect(projection.rotate()).toEqual([0, 0, 10])
    expect(projection.translate()).toEqual([30, 40])
    expect(projection.clipAngle()).toBe(90)
    expect(projection.clipExtent()).toEqual([[0, 0], [90, 80]])
    expect(projection.precision()).toBe(0.5)
    expect(projection.reflectX()).toBe(true)
    expect(projection.reflectY()).toBe(true)
  })

  it('applies fitSize from config', () => {
    const projection = makeProjectionFromBase({
      config: {
        fitSize: [[100, 80], sphereGeoJson],
      },
    })

    expect(projection.scale()).toBeGreaterThan(0)
    expect(projection.translate()).toEqual([50, 40])
  })

  it('applies fitExtent from config', () => {
    const projection = makeProjectionFromBase({
      config: {
        fitExtent: [[[0, 0], [100, 80]], sphereGeoJson],
      },
    })

    expect(projection.scale()).toBeGreaterThan(0)
    expect(projection.translate()).toEqual([50, 40])
  })

  it('applies fitWidth from config', () => {
    const projection = makeProjectionFromBase({
      config: {
        fitWidth: [120, sphereGeoJson],
      },
    })

    expect(projection.scale()).toBeGreaterThan(0)
    expect(projection.translate()[0]).toBeCloseTo(60)
  })

  it('applies fitHeight from config', () => {
    const projection = makeProjectionFromBase({
      config: {
        fitHeight: [90, sphereGeoJson],
      },
    })

    expect(projection.scale()).toBeGreaterThan(0)
    expect(projection.translate()[1]).toBeCloseTo(45)
  })
})

describe('makeFeatures', () => {
  it('returns features from geojson and runs transformer', () => {
    const features = makeFeatures(sampleGeoJson, (items) => items.slice(0, 1))

    expect(features).toHaveLength(1)
    expect(features[0].properties?.id).toBe('demo')
  })

  it('uses the requested topology object', () => {
    const features = makeFeatures(sampleTopologyTwoObjects, undefined, 'pair')

    expect(features).toHaveLength(2)
    expect(features.map((feature) => feature.properties?.id)).toEqual(['pair-1', 'pair-2'])
  })
})

describe('makeMesh', () => {
  it('returns undefined for geojson input', () => {
    expect(makeMesh(sampleGeoJson)).toBeUndefined()
  })

  it('returns a mesh for topology input', () => {
    const topologyMesh = makeMesh(sampleTopology)

    expect(topologyMesh?.type).toBe('MultiLineString')
    expect(topologyMesh?.coordinates.length).toBeGreaterThan(0)
  })

  it('uses the requested topology object for topology meshes', () => {
    const defaultMesh = makeMesh(sampleTopologyTwoObjects)
    const selectedMesh = makeMesh(sampleTopologyTwoObjects, 'pair')

    expect(defaultMesh?.coordinates).toHaveLength(1)
    expect(selectedMesh?.coordinates).toHaveLength(2)
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
    expect(context.renderMesh()).toBeNull()
  })

  it('includes mesh helpers for topology input', () => {
    const context = makeMapContext({ data: sampleTopology })
    expect(typeof context.renderMesh()).toBe('string')
  })

  it('uses the requested topology object throughout the map context', () => {
    const context = makeMapContext({
      data: sampleTopologyTwoObjects,
      topologyObjectKey: 'pair',
    })

    expect(context.features).toHaveLength(2)
    expect(typeof context.renderMesh()).toBe('string')
  })
})

describe('getTopoObject', () => {
  it('falls back to the first topology object', () => {
    expect(getTopoObject(sampleTopologyTwoObjects).type).toBe('Polygon')
  })

  it('returns the requested topology object', () => {
    expect(getTopoObject(sampleTopologyTwoObjects, 'pair').type).toBe('GeometryCollection')
  })
})

describe('isTopology', () => {
  it('returns false for geojson input', () => {
    expect(isTopology(sampleGeoJson)).toBe(false)
  })
})
