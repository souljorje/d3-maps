import { describe, expect, expectTypeOf, it } from 'vitest'

import type { GeoPermissibleObjects } from 'd3-geo'
import type { Topology } from 'topojson-specification'

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
  sampleGeoJsonTwoFeatures,
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

  it('defaults to sphere fit when no fit mode or explicit fit method is provided', () => {
    const defaultProjection = makeProjectionFromBase()
    const sphereProjection = makeProjectionFromBase({
      config: {
        fit: 'sphere',
      },
      features: sampleGeoJson.features,
    })

    expect(defaultProjection.scale()).toBeCloseTo(sphereProjection.scale())
    expect(defaultProjection.translate()).toEqual(sphereProjection.translate())
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

  it('fits to normalized features when requested', () => {
    const sphereProjection = makeProjectionFromBase({
      config: {
        fit: 'sphere',
      },
      features: sampleGeoJson.features,
    })
    const featuresProjection = makeProjectionFromBase({
      config: {
        fit: 'features',
      },
      features: sampleGeoJson.features,
    })

    expect(featuresProjection.scale()).toBeGreaterThan(sphereProjection.scale())
  })

  it('fits to one feature object when requested', () => {
    const featuresProjection = makeProjectionFromBase({
      config: {
        fit: 'features',
      },
      features: sampleGeoJsonTwoFeatures.features,
    })
    const objectProjection = makeProjectionFromBase({
      config: {
        fit: 'object',
        fitObjectId: 'demo',
      },
      features: sampleGeoJsonTwoFeatures.features,
    })

    expect(objectProjection.scale()).toBeGreaterThan(featuresProjection.scale())
  })

  it('explicit fit methods override fit mode', () => {
    const projection = makeProjectionFromBase({
      config: {
        fit: 'features',
        fitWidth: [120, sphereGeoJson],
      },
      features: sampleGeoJson.features,
    })

    expect(projection.translate()[0]).toBeCloseTo(60)
  })

  it('throws when object fit is requested without fitObjectId', () => {
    expect(() => makeProjectionFromBase({
      config: {
        fit: 'object',
      },
      features: sampleGeoJson.features,
    })).toThrow(/fitObjectId/)
  })

  it('throws when object fit target is missing', () => {
    expect(() => makeProjectionFromBase({
      config: {
        fit: 'object',
        fitObjectId: 'missing',
      },
      features: sampleGeoJson.features,
    })).toThrow(/missing/)
  })
})

describe('makeFeatures', () => {
  it('returns features from geojson and runs transformer', () => {
    const features = makeFeatures(sampleGeoJson, (items) => items.slice(0, 1))

    expect(features).toHaveLength(1)
    expect(features[0].properties?.id).toBe('demo')
  })

  it('merges features from multiple topology inputs', () => {
    const features = makeFeatures([sampleTopology, sampleTopology])

    expect(features).toHaveLength(2)
    expect(features.map((feature) => feature.properties?.id)).toEqual(['demo', 'demo'])
  })

  it('merges features from multiple geojson inputs', () => {
    const features = makeFeatures([sampleGeoJson, sampleGeoJson])

    expect(features).toHaveLength(2)
    expect(features.map((feature) => feature.properties?.id)).toEqual(['demo', 'demo'])
  })

  it('merges features from mixed topology and geojson inputs', () => {
    const mixedData = [sampleTopology, sampleGeoJson]
    const features = makeFeatures(mixedData)

    expectTypeOf(features).toMatchTypeOf(sampleGeoJson.features)
    expect(features).toHaveLength(2)
    expect(features.map((feature) => feature.properties?.id)).toEqual(['demo', 'demo'])
  })

  it('runs the transformer after merging array inputs', () => {
    const features = makeFeatures(
      [sampleTopology, sampleGeoJson, sampleTopology],
      (items) => items.slice(1, 3),
    )

    expect(features).toHaveLength(2)
    expect(features.map((feature) => feature.properties?.id)).toEqual(['demo', 'demo'])
  })

  it('uses the requested topology object', () => {
    const features = makeFeatures(sampleTopologyTwoObjects, undefined, 'pair')

    expect(features).toHaveLength(2)
    expect(features.map((feature) => feature.properties?.id)).toEqual(['pair-1', 'pair-2'])
  })

  it('throws a helpful error for an unknown topology object key', () => {
    expect(() => makeFeatures(sampleTopologyTwoObjects, undefined, 'missing'))
      .toThrow()
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

  it('returns undefined for multiple topology inputs', () => {
    expect(makeMesh([sampleTopology, sampleTopology])).toBeUndefined()
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

  it('passes normalized features into projection fitting', () => {
    const context = makeMapContext({
      width: 400,
      height: 300,
      data: sampleGeoJsonTwoFeatures,
      dataTransformer: (features) => features.slice(1),
      projectionConfig: {
        fit: 'features',
      },
    })

    const expectedProjection = makeProjection({
      width: 400,
      height: 300,
      projection: geoNaturalEarth1,
      config: {
        fit: 'features',
      },
      features: [sampleGeoJsonTwoFeatures.features[1]],
    })

    expect(context.projection.scale()).toBeCloseTo(expectedProjection.scale())
    expect(context.projection.translate()).toEqual(expectedProjection.translate())
  })

  it('includes mesh helpers for topology input', () => {
    const context = makeMapContext({ data: sampleTopology })
    expect(typeof context.renderMesh()).toBe('string')
  })

  it('merges features from array map data', () => {
    const context = makeMapContext({ data: [sampleTopology, sampleTopology] })

    expect(context.features).toHaveLength(2)
    expect(context.renderMesh()).toBeNull()
  })

  it('uses the requested topology object throughout the map context', () => {
    const context = makeMapContext({
      data: sampleTopologyTwoObjects,
      topologyObjectKey: 'pair',
    })

    expect(context.features).toHaveLength(2)
    expect(typeof context.renderMesh()).toBe('string')
  })

  it('fits to normalized features by default in features mode', () => {
    const oneFeature = makeMapContext({
      data: sampleGeoJson,
      projectionConfig: {
        fit: 'features',
      },
    })

    const twoFeatures = makeMapContext({
      data: sampleGeoJsonTwoFeatures,
      projectionConfig: {
        fit: 'features',
      },
    })

    expect(oneFeature.features).toHaveLength(1)
    expect(twoFeatures.features).toHaveLength(2)
    expect(twoFeatures.projection.scale()).toBeLessThan(oneFeature.projection.scale())
  })

  it('fits to a selected topology object in object mode', () => {
    const featuresMode = makeMapContext({
      data: sampleGeoJsonTwoFeatures,
      projectionConfig: {
        fit: 'features',
      },
    })

    const objectMode = makeMapContext({
      data: sampleGeoJsonTwoFeatures,
      projectionConfig: {
        fit: 'object',
        fitObjectId: 'demo-2',
      },
    })

    expect(featuresMode.features).toHaveLength(2)
    expect(objectMode.features).toHaveLength(2)
    expect(objectMode.projection.scale()).toBeGreaterThan(featuresMode.projection.scale())
  })

  it('throws when object mode has no usable fitObjectId', () => {
    expect(() => makeMapContext({
      data: sampleGeoJsonTwoFeatures,
      projectionConfig: {
        fit: 'object',
      },
    })).toThrow()

    expect(() => makeMapContext({
      data: sampleGeoJsonTwoFeatures,
      projectionConfig: {
        fit: 'object',
        fitObjectId: 'missing',
      },
    })).toThrow()
  })

  it('prefers explicit fitSize over fit mode', () => {
    const context = makeMapContext({
      data: sampleTopologyTwoObjects,
      projectionConfig: {
        fit: 'object',
        fitObjectId: 'pair',
        fitSize: [[100, 80], sphereGeoJson],
      },
    })

    expect(context.projection.scale()).toBeGreaterThan(0)
    expect(context.projection.translate()).toEqual([50, 40])
  })
})

describe('getTopoObject', () => {
  it('falls back to the first topology object', () => {
    expect(getTopoObject(sampleTopologyTwoObjects).type).toBe('Polygon')
  })

  it('returns the requested topology object', () => {
    expect(getTopoObject(sampleTopologyTwoObjects, 'pair').type).toBe('GeometryCollection')
  })

  it('throws when topology data does not contain any objects', () => {
    const emptyTopology = {
      type: 'Topology',
      transform: { scale: [1, 1], translate: [0, 0] },
      objects: {},
      arcs: [],
    } satisfies Topology

    expect(() => getTopoObject(emptyTopology)).toThrow()
  })
})

describe('isTopology', () => {
  it('returns false for geojson input', () => {
    expect(isTopology(sampleGeoJson)).toBe(false)
  })
})
