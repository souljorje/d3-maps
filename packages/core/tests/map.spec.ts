import { describe, expect, expectTypeOf, it } from 'vitest'

import type { GeoPermissibleObjects } from 'd3-geo'

import {
  geoNaturalEarth1,
  geoPath,
} from 'd3-geo'

import {
  getMapObjectKey,
  isFeature,
  isTopology,
  makeMapContext,
  makeMapObjects,
  makeMesh,
  makeProjection,
  normalizeMapData,
  resolveMapData,
  resolveMapDataRef,
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
    const sphereProjection = makeProjectionFromBase({ fit: sphereGeoJson })

    expect(projection.scale()).toBeCloseTo(sphereProjection.scale())
    expectProjectionTranslation(projection, sphereProjection.translate() as [number, number])
  })

  it('supports manual mode', () => {
    const manualProjection = makeProjectionFromBase({ fit: 'manual' })
    const rawProjection = geoNaturalEarth1()

    expect(manualProjection.scale()).toBeCloseTo(rawProjection.scale())
    expectProjectionTranslation(manualProjection, rawProjection.translate() as [number, number])
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

  it('applies padding to implicit fit modes', () => {
    const defaultProjection = makeProjectionFromBase({ fit: sphereGeoJson })
    const paddedProjection = makeProjectionFromBase({
      fit: sphereGeoJson,
      config: { padding: 10 },
    })

    expect(paddedProjection.scale()).toBeLessThan(defaultProjection.scale())
    expectProjectionTranslation(paddedProjection, [50, 50])
  })

  it('prefers explicit fit methods over built-in fit', () => {
    const projection = makeProjectionFromBase({
      fit: sampleGeoJson.features[0],
      config: {
        padding: 10,
        fitWidth: [120, sphereGeoJson],
      },
    })

    expect(projection.translate()[0]).toBeCloseTo(60)
  })
})

describe('map data', () => {
  it('normalizes features and geometries into object units', () => {
    expect(normalizeMapData(sampleGeoJsonTwoFeatures)).toHaveLength(2)
    expect(normalizeMapData(sampleTopology)).toHaveLength(1)
    expect(normalizeMapData(sampleTopologyTwoObjects, sampleTopologyObjectKey)).toHaveLength(2)
    expect(normalizeMapData(sampleGeoJson)).toHaveLength(1)
    expect(normalizeMapData(sampleGeometryCollection)).toHaveLength(2)
    expect(normalizeMapData(samplePolygon)).toHaveLength(1)
  })

  it('preserves feature geometry collections as single feature objects', () => {
    expect(normalizeMapData(sampleGeometryCollectionFeature)).toEqual([sampleGeometryCollectionFeature])
  })

  it('keeps topology-derived geometry collections as features after topojson normalization', () => {
    const data = normalizeMapData(sampleTopologyTwoObjects, sampleTopologyObjectKey)

    expect(data).toHaveLength(2)
    expect(data.every((object) => isFeature(object))).toBe(true)
  })

  it('applies data transformers after normalization', () => {
    const data = resolveMapData(
      sampleTopologyTwoObjects,
      sampleTopologyObjectKey,
      (objects) => objects.slice(0, 1),
    )

    expect(data).toHaveLength(1)
  })

  it('resolves layer data refs from local props and shared context', () => {
    expect(resolveMapDataRef(
      { data: sampleGeoJson },
      { data: sampleTopologyTwoObjects, objectKey: sampleTopologyObjectKey },
    )).toEqual([sampleGeoJson, sampleTopologyObjectKey])

    expect(resolveMapDataRef(
      { objectKey: sampleTopologyObjectKey },
      { data: sampleTopologyTwoObjects },
    )).toEqual([sampleTopologyTwoObjects, sampleTopologyObjectKey])
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
    const selectedMesh = makeMesh(sampleTopologyTwoObjects, sampleTopologyObjectKey)

    expect(defaultMesh?.coordinates).toHaveLength(1)
    expect(selectedMesh?.coordinates).toHaveLength(2)
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
    expect(context.data).toBe(sampleGeoJson)
    expect(context.objectData).toHaveLength(1)
    expect(context.objects).toHaveLength(1)
    expect(typeof context.path(context.objects[0])).toBe('string')
  })

  it('supports empty shared data with sphere fitting', () => {
    const context = makeMapContext()

    expect(context.data).toBeUndefined()
    expect(context.objectData).toEqual([])
    expect(context.objects).toEqual([])
    expect(context.projection.scale()).toBeGreaterThan(0)
  })

  it('passes transformed shared data into data fitting', () => {
    const context = makeMapContext({
      width: 400,
      height: 300,
      data: sampleGeoJsonTwoFeatures,
      dataTransformer: (objects) => objects.slice(1),
      fit: 'data',
    })

    const expectedProjection = makeProjection({
      width: 400,
      height: 300,
      projection: geoNaturalEarth1,
      fit: {
        type: 'GeometryCollection',
        geometries: [sampleGeoJsonTwoFeatures.features[1].geometry],
      },
    })

    expect(context.objectData).toHaveLength(1)
    expect(context.projection.scale()).toBeCloseTo(expectedProjection.scale())
    expectProjectionTranslation(
      context.projection as ReturnType<typeof makeProjection>,
      expectedProjection.translate() as [number, number],
    )
  })

  it('uses objectKey throughout the context', () => {
    const context = makeMapContext({
      data: sampleTopologyTwoObjects,
      objectKey: sampleTopologyObjectKey,
    })

    expect(context.objectKey).toBe(sampleTopologyObjectKey)
    expect(context.objects).toHaveLength(2)
  })

  it('supports fit sphere, fit data, fit manual, and explicit fit data', () => {
    const sphereFit = makeMapContext({
      data: sampleGeoJsonTwoFeatures,
      fit: 'sphere',
    })
    const dataFit = makeMapContext({
      data: sampleGeoJsonTwoFeatures,
      fit: 'data',
    })
    const manualFit = makeMapContext({
      fit: 'manual',
      projectionConfig: {
        scale: 160,
        translate: [[40, 50]],
      },
    })
    const explicitFit = makeMapContext({
      data: sampleGeoJson,
      fit: sampleTopologyTwoObjects,
      fitObjectKey: sampleTopologyObjectKey,
    })

    expect(dataFit.projection.scale()).toBeGreaterThan(sphereFit.projection.scale())
    expect(manualFit.projection.scale()).toBeCloseTo(160)
    expectProjectionTranslation(manualFit.projection as ReturnType<typeof makeProjection>, [40, 50])
    expect(explicitFit.projection.scale()).toBeGreaterThan(0)
  })

  it('does not apply dataTransformer to explicit fit data', () => {
    const context = makeMapContext({
      data: sampleGeoJsonTwoFeatures,
      dataTransformer: (objects) => objects.slice(0, 1),
      fit: sampleGeoJsonTwoFeatures,
    })
    const transformedFit = makeMapContext({
      data: sampleGeoJsonTwoFeatures,
      dataTransformer: (objects) => objects.slice(0, 1),
      fit: 'data',
    })

    expect(context.projection.scale()).toBeLessThan(transformedFit.projection.scale())
  })
})

describe('makeMapObjects', () => {
  it('enriches normalized objects with keys and paths', () => {
    const projection = makeProjectionFromBase()
    const objects = makeMapObjects(
      normalizeMapData(sampleGeoJsonTwoFeatures),
      geoPath().projection(projection),
    )

    expect(objects).toHaveLength(2)
    expect(objects[0]?.key).toBe('demo')
    expect(typeof objects[0]?.d).toBe('string')
  })

  it('uses the custom key accessor when provided', () => {
    const projection = makeProjectionFromBase()
    const objects = makeMapObjects(
      normalizeMapData(sampleGeoJsonTwoFeatures),
      geoPath().projection(projection),
      (item, index) => isFeature(item)
        ? item.properties?.id ?? `custom-${index}`
        : undefined,
    )

    expect(objects.map(({ key }) => key)).toEqual(['demo', 'demo-2'])
  })
})

describe('getMapObjectKey', () => {
  it('prefers item id, then properties.id, then properties.name, then index', () => {
    expect(getMapObjectKey(sampleGeoJson.features[0], 9)).toBe('demo')
    expect(getMapObjectKey({
      ...sampleGeoJson.features[0],
      id: undefined,
    }, 9)).toBe('demo')
    expect(getMapObjectKey({
      ...sampleGeoJson.features[0],
      id: undefined,
      properties: { name: 'named-feature' },
    }, 9)).toBe('named-feature')
    expect(getMapObjectKey(samplePolygon, 9)).toBe(9)
  })
})

describe('isTopology', () => {
  it('detects topology input', () => {
    expect(isTopology(sampleTopology)).toBe(true)
    expect(isTopology(sampleGeoJson)).toBe(false)
  })
})
