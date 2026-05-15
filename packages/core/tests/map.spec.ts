import { describe, expect, expectTypeOf, it } from 'vitest'

import type { GeoPermissibleObjects } from 'd3-geo'
import type { Topology } from 'topojson-specification'

import { geoNaturalEarth1 } from 'd3-geo'

import {
  getTopoObject,
  isTopology,
  makeMapContext,
  makeMesh,
  makeObjectsFromItem,
  makeProjection,
} from '../src'
import {
  sampleGeoJson,
  sampleGeoJsonTwoFeatures,
  sampleGeometryCollection,
  samplePolygon,
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

const EMPTY_TOPOLOGY = {
  type: 'Topology',
  transform: { scale: [1, 1], translate: [0, 0] },
  objects: {},
  arcs: [],
} satisfies Topology

function makeProjectionFromBase(overrides: Partial<Parameters<typeof makeProjection>[0]> = {}) {
  return makeProjection({
    ...PROJECTION_BASE,
    ...overrides,
  })
}

function expectProjectionTranslation(
  projection: ReturnType<typeof makeProjection>,
  expected: [number, number],
) {
  expect(projection.translate()).toEqual(expected)
}

describe('makeProjection', () => {
  it('creates a projection instance', () => {
    const projection = makeProjectionFromBase()
    expectTypeOf(projection).toEqualTypeOf(geoNaturalEarth1())
  })

  it('defaults to sphere fit', () => {
    const projection = makeProjectionFromBase()
    const sphereProjection = makeProjectionFromBase({
      config: { fit: 'sphere' },
    })

    expect(projection.scale()).toBeCloseTo(sphereProjection.scale())
    expectProjectionTranslation(projection, sphereProjection.translate() as [number, number])
  })

  it('applies projection modifiers', () => {
    const projection = makeProjectionFromBase({
      config: {
        angle: 12,
        center: [[20, 10]],
        rotate: [[0, 0, 10]],
        scale: 200,
        translate: [[30, 40]],
        clipAngle: 90,
        clipExtent: [[[0, 0], [90, 80]]],
        precision: 0.5,
        reflectX: true,
        reflectY: true,
      },
    })

    expect(projection.angle()).toBeCloseTo(12)
    expect(projection.center()).toEqual([20, 10])
    expect(projection.rotate()).toEqual([0, 0, 10])
    expect(Math.round(projection.scale())).toBe(200)
    expectProjectionTranslation(projection, [30, 40])
    expect(projection.clipAngle()).toBe(90)
    expect(projection.clipExtent()).toEqual([[0, 0], [90, 80]])
    expect(projection.precision()).toBe(0.5)
    expect(projection.reflectX()).toBe(true)
    expect(projection.reflectY()).toBe(true)
  })

  it.each([
    ['fitSize', { fitSize: [[100, 80], sphereGeoJson] }, [50, 40]],
    ['fitExtent', { fitExtent: [[[0, 0], [100, 80]], sphereGeoJson] }, [50, 40]],
  ] as const)('applies %s from config', (_name, config, expectedTranslate) => {
    const projection = makeProjectionFromBase({ config })

    expect(projection.scale()).toBeGreaterThan(0)
    expectProjectionTranslation(projection, expectedTranslate)
  })

  it('applies fitWidth from config', () => {
    const projection = makeProjectionFromBase({
      config: { fitWidth: [120, sphereGeoJson] },
    })

    expect(projection.scale()).toBeGreaterThan(0)
    expect(projection.translate()[0]).toBeCloseTo(60)
  })

  it('applies fitHeight from config', () => {
    const projection = makeProjectionFromBase({
      config: { fitHeight: [90, sphereGeoJson] },
    })

    expect(projection.scale()).toBeGreaterThan(0)
    expect(projection.translate()[1]).toBeCloseTo(45)
  })

  it('fits to an explicit object', () => {
    const sphereProjection = makeProjectionFromBase({
      config: { fit: 'sphere' },
    })
    const objectProjection = makeProjectionFromBase({
      config: {
        fit: 'object',
        fitObject: sampleGeoJson.features[0],
      },
    })

    expect(objectProjection.scale()).toBeGreaterThan(sphereProjection.scale())
  })

  it('fits to normalized features', () => {
    const sphereProjection = makeProjectionFromBase({
      config: { fit: 'sphere' },
    })
    const featuresProjection = makeProjectionFromBase({
      config: { fit: 'features' },
      features: sampleGeoJson.features,
    })

    expect(featuresProjection.scale()).toBeGreaterThan(sphereProjection.scale())
  })

  it('throws for invalid fit inputs', () => {
    expect(() => makeProjectionFromBase({
      config: { fit: 'object' },
    })).toThrow('projectionConfig.fitObject is required when projectionConfig.fit is "object"')

    expect(() => makeProjectionFromBase({
      config: { fit: 'features' },
    })).toThrow('projectionConfig.fit "features" requires at least one feature')
  })

  it('prefers explicit fit methods over fit mode', () => {
    const projection = makeProjectionFromBase({
      config: {
        fit: 'features',
        fitWidth: [120, sphereGeoJson],
      },
      features: sampleGeoJson.features,
    })

    expect(projection.translate()[0]).toBeCloseTo(60)
  })
})

describe('normalizers', () => {
  it('flattens features and geometries into object units', () => {
    expect(makeObjectsFromItem(sampleGeoJsonTwoFeatures)).toHaveLength(2)
    expect(makeObjectsFromItem(sampleTopology)).toHaveLength(1)
    expect(makeObjectsFromItem(sampleTopologyTwoObjects, 'pair')).toHaveLength(2)
    expect(makeObjectsFromItem(sampleGeoJson)).toHaveLength(1)
    expect(makeObjectsFromItem(sampleGeoJsonTwoFeatures)).toHaveLength(2)
    expect(makeObjectsFromItem(sampleGeometryCollection)).toHaveLength(2)
    expect(makeObjectsFromItem(samplePolygon)).toHaveLength(1)
  })

  it('derives geometries only from geometry inputs', () => {
    const context = makeMapContext({ data: sampleGeometryCollection })

    expect(context.geometries.map(({ data }) => data.type)).toEqual(['Polygon', 'LineString'])
    expect(context.features).toEqual([])
  })

  it('keeps topology-derived geometry collections as features after topojson normalization', () => {
    const context = makeMapContext({
      data: sampleTopologyTwoObjects,
      topologyObjectKey: 'pair',
    })

    expect(context.features).toHaveLength(2)
    expect(context.geometries).toEqual([])
  })
})

describe('makeMesh', () => {
  it('returns undefined for non-topology input', () => {
    expect(makeMesh(sampleGeoJson)).toBeUndefined()
  })

  it('returns a mesh for topology input', () => {
    const topologyMesh = makeMesh(sampleTopology)

    expect(topologyMesh?.type).toBe('MultiLineString')
    expect(topologyMesh?.coordinates.length).toBeGreaterThan(0)
  })

  it('uses the requested topology object', () => {
    const defaultMesh = makeMesh(sampleTopologyTwoObjects)
    const selectedMesh = makeMesh(sampleTopologyTwoObjects, 'pair')

    expect(defaultMesh?.coordinates).toHaveLength(1)
    expect(selectedMesh?.coordinates).toHaveLength(2)
  })

  it('returns undefined for multiple topology inputs', () => {
    expect(makeMesh([sampleTopology, sampleTopology])).toBeUndefined()
  })
})

describe('makeMapContext', () => {
  it('builds render-ready context', () => {
    const context = makeMapContext({
      width: 400,
      height: 300,
      data: sampleGeoJson,
    })

    expect(context.width).toBe(400)
    expect(context.height).toBe(300)
    expect(context.features).toHaveLength(1)
    expect(context.geometries).toEqual([])
    expect(typeof context.path(context.features[0].data)).toBe('string')
    expect(context.renderMesh()).toBeNull()
  })

  it('passes transformed features into projection fitting', () => {
    const context = makeMapContext({
      width: 400,
      height: 300,
      data: sampleGeoJsonTwoFeatures,
      dataTransformer: (features) => features.slice(1),
      projectionConfig: { fit: 'features' },
    })

    const expectedProjection = makeProjection({
      width: 400,
      height: 300,
      projection: geoNaturalEarth1,
      config: { fit: 'features' },
      features: [sampleGeoJsonTwoFeatures.features[1]],
    })

    expect(context.projection.scale()).toBeCloseTo(expectedProjection.scale())
    expectProjectionTranslation(
      context.projection as ReturnType<typeof makeProjection>,
      expectedProjection.translate() as [number, number],
    )
  })

  it('includes mesh path for topology input', () => {
    const context = makeMapContext({ data: sampleTopology })
    expect(typeof context.renderMesh()).toBe('string')
  })

  it('merges features from array map data', () => {
    const context = makeMapContext({ data: [sampleTopology, sampleTopology] })

    expect(context.features).toHaveLength(2)
    expect(context.geometries).toEqual([])
    expect(context.renderMesh()).toBeNull()
  })

  it('uses the requested topology object throughout the context', () => {
    const context = makeMapContext({
      data: sampleTopologyTwoObjects,
      topologyObjectKey: 'pair',
    })

    expect(context.features).toHaveLength(2)
    expect(context.geometries).toEqual([])
    expect(typeof context.renderMesh()).toBe('string')
  })

  it('supports object fit and features fit', () => {
    const sphereFit = makeMapContext({
      data: sampleGeoJsonTwoFeatures,
      projectionConfig: { fit: 'sphere' },
    })
    const objectFit = makeMapContext({
      data: sampleGeoJsonTwoFeatures,
      projectionConfig: {
        fit: 'object',
        fitObject: sampleGeoJsonTwoFeatures.features[1],
      },
    })
    const featuresFit = makeMapContext({
      data: sampleGeoJsonTwoFeatures,
      projectionConfig: { fit: 'features' },
    })

    expect(objectFit.projection.scale()).toBeGreaterThan(sphereFit.projection.scale())
    expect(featuresFit.projection.scale()).toBeGreaterThan(sphereFit.projection.scale())
  })

  it('throws for invalid fit configuration', () => {
    expect(() => makeMapContext({
      data: sampleGeoJsonTwoFeatures,
      projectionConfig: { fit: 'object' },
    })).toThrow('projectionConfig.fitObject is required when projectionConfig.fit is "object"')

    expect(() => makeMapContext({
      data: sampleGeometryCollection,
      projectionConfig: { fit: 'features' },
    })).toThrow('projectionConfig.fit "features" requires at least one feature')
  })

  it('prefers explicit fit methods over fit mode', () => {
    const context = makeMapContext({
      data: sampleTopologyTwoObjects,
      projectionConfig: {
        fit: 'object',
        fitObject: sampleGeoJson.features[0],
        fitSize: [[100, 80], sphereGeoJson],
      },
    })

    expect(context.projection.scale()).toBeGreaterThan(0)
    expectProjectionTranslation(context.projection as ReturnType<typeof makeProjection>, [50, 40])
  })
})

describe('getTopoObject', () => {
  it('falls back to the first topology object', () => {
    expect(getTopoObject(sampleTopologyTwoObjects).type).toBe('Polygon')
  })

  it('returns the requested topology object', () => {
    expect(getTopoObject(sampleTopologyTwoObjects, 'pair').type).toBe('GeometryCollection')
  })

  it('throws when topology has no objects', () => {
    expect(() => getTopoObject(EMPTY_TOPOLOGY)).toThrow()
  })
})

describe('isTopology', () => {
  it('detects topology input', () => {
    expect(isTopology(sampleTopology)).toBe(true)
    expect(isTopology(sampleGeoJson)).toBe(false)
  })
})
