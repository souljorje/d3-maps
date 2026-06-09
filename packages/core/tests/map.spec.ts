import { describe, expect, expectTypeOf, it } from 'vitest'

import {
  geoNaturalEarth1,
} from 'd3-geo'

import {
  makeMapContext,
  makeProjection,
  SPHERE,
} from '../src'
import {
  sampleGeoJson,
  sampleGeoJsonTwoFeatures,
  sampleTopologyObjectKey,
  sampleTopologyTwoObjects,
} from './fixtures'

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
    const sphereProjection = makeProjectionFromBase({ fit: 'sphere' })

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

  it('applies fitSize from config in manual mode', () => {
    const projection = makeProjectionFromBase({
      config: { fitSize: [[100, 80], SPHERE] },
      fit: 'manual',
    })

    expect(projection.scale()).toBeGreaterThan(0)
    expectProjectionTranslation(projection, [50, 40])
  })

  it('applies fitExtent from config in manual mode', () => {
    const projection = makeProjectionFromBase({
      config: { fitExtent: [[[0, 0], [100, 80]], SPHERE] },
      fit: 'manual',
    })

    expect(projection.scale()).toBeGreaterThan(0)
    expectProjectionTranslation(projection, [50, 40])
  })

  it('applies fitWidth from config', () => {
    const projection = makeProjectionFromBase({
      config: { fitWidth: [120, SPHERE] },
      fit: 'manual',
    })

    expect(projection.scale()).toBeGreaterThan(0)
    expect(projection.translate()[0]).toBeCloseTo(60)
  })

  it('applies fitHeight from config', () => {
    const projection = makeProjectionFromBase({
      config: { fitHeight: [90, SPHERE] },
      fit: 'manual',
    })

    expect(projection.scale()).toBeGreaterThan(0)
    expect(projection.translate()[1]).toBeCloseTo(45)
  })

  it('applies padding to implicit fit modes', () => {
    const defaultProjection = makeProjectionFromBase({ fit: 'sphere' })
    const paddedProjection = makeProjectionFromBase({
      fit: 'sphere',
      padding: 10,
    })

    expect(paddedProjection.scale()).toBeLessThan(defaultProjection.scale())
    expectProjectionTranslation(paddedProjection, [50, 50])
  })

  it('applies explicit fit methods in manual mode', () => {
    const projection = makeProjectionFromBase({
      fit: 'manual',
      config: {
        fitWidth: [120, SPHERE],
      },
    })

    expect(projection.translate()[0]).toBeCloseTo(60)
  })
})

describe('makeMapContext', () => {
  it('builds projection-ready context', () => {
    const context = makeMapContext({
      width: 400,
      height: 300,
      fit: sampleGeoJson,
    })

    expect(context.width).toBe(400)
    expect(context.height).toBe(300)
    expect(context.projection.scale()).toBeGreaterThan(0)
    expect(typeof context.path(sampleGeoJson.features[0])).toBe('string')
  })

  it('supports default sphere fitting without shared data', () => {
    const context = makeMapContext()

    expect(context.projection.scale()).toBeGreaterThan(0)
  })

  it('fits explicit data sources', () => {
    const context = makeMapContext({
      width: 400,
      height: 300,
      fit: sampleGeoJsonTwoFeatures,
    })

    const expectedProjection = makeProjection({
      width: 400,
      height: 300,
      projection: geoNaturalEarth1,
      fit: {
        type: 'GeometryCollection',
        geometries: sampleGeoJsonTwoFeatures.features.map(({ geometry }) => geometry),
      },
    })

    expect(context.projection.scale()).toBeCloseTo(expectedProjection.scale())
    expectProjectionTranslation(
      context.projection as ReturnType<typeof makeProjection>,
      expectedProjection.translate() as [number, number],
    )
  })

  it('uses fitObjectKey when fitting topology data', () => {
    const context = makeMapContext({
      fit: sampleTopologyTwoObjects,
      fitObjectKey: sampleTopologyObjectKey,
    })

    expect(context.projection.scale()).toBeGreaterThan(0)
  })

  it('supports fit sphere, fit manual, and explicit fit data', () => {
    const sphereFit = makeMapContext({
      fit: 'sphere',
    })
    const manualFit = makeMapContext({
      fit: 'manual',
      projectionConfig: {
        scale: 160,
        translate: [[40, 50]],
      },
    })
    const explicitFit = makeMapContext({
      fit: sampleTopologyTwoObjects,
      fitObjectKey: sampleTopologyObjectKey,
    })

    expect(manualFit.projection.scale()).toBeCloseTo(160)
    expectProjectionTranslation(manualFit.projection as ReturnType<typeof makeProjection>, [40, 50])
    expect(explicitFit.projection.scale()).toBeGreaterThan(0)
    expect(sphereFit.projection.scale()).toBeGreaterThan(0)
  })

  it('defaults to sphere fit when fit is omitted', () => {
    const context = makeMapContext()
    const sphereFit = makeMapContext({ fit: 'sphere' })

    expect(context.projection.scale()).toBeCloseTo(sphereFit.projection.scale())
    expectProjectionTranslation(
      context.projection as ReturnType<typeof makeProjection>,
      sphereFit.projection.translate() as [number, number],
    )
  })
})
