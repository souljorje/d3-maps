import type { GeoPath, GeoProjection } from 'd3-geo'
import type {
  Feature,
  FeatureCollection,
  MultiLineString,
} from 'geojson'
import type { GeometryObject, Topology } from 'topojson-specification'

import type { MapFeature } from './feature'
import type {
  MethodsToModifiers,
} from './utils'

import {
  geoEqualEarth,
  geoPath,
} from 'd3-geo'
import {
  feature,
  mesh,
} from 'topojson-client'

import { applyModifiers } from './utils'

export type MapData = FeatureCollection | Topology
export type DataTransformer = (features: MapFeature[]) => MapFeature[]

/**
 * Extra projection method calls to apply before rendering.
 *
 * Use projection method names as keys and method arguments as values.
 * Example: `{ center: [[0, 20]], rotate: [[0, 0, 0]], scale: 160 }`
 *
 * @see https://d3js.org/d3-geo/projection
 */
export interface ProjectionConfig extends MethodsToModifiers<GeoProjection> {}

/**
 * Input configuration for creating a map context.
 *
 * In adapters, this is usually passed as component props.
 */
export interface MapConfig {
  width?: number
  height?: number
  aspectRatio?: number
  /**
   * Projection factory from d3-geo (or a compatible implementation).
   *
   * Example: `geoEqualEarth`.
   */
  projection?: () => GeoProjection
  /**
   * Projection method arguments passed to the created projection
   */
  projectionConfig?: ProjectionConfig
  /**
   * TopoJSON or GeoJSON input.
   *
   * TopoJSON is automatically converted to GeoJSON features.
   */
  data: MapData
  /**
   * Optional feature transformer (filter/augment/normalize features).
   */
  dataTransformer?: DataTransformer
}

/**
 * Fully computed, framework-agnostic map context.
 *
 * Adapters provide this context to child layers (features, markers, custom SVG).
 */
export interface MapContext {
  width: number
  height: number
  projection?: GeoProjection
  features: MapFeature[]
  mesh?: MultiLineString
  path: GeoPath
  renderPath: (feature: Feature) => ReturnType<GeoPath>
  renderMesh: () => ReturnType<GeoPath>
}

/**
 * Creates a configured projection and fits it to the provided GeoJSON (if present).
 */
export function makeProjection({
  width,
  height,
  config,
  projection,
  geoJson,
}: {
  width: number
  height: number
  config?: ProjectionConfig
  projection: () => GeoProjection
  geoJson?: FeatureCollection
}): GeoProjection {
  const mapProjection = projection()

  if (!geoJson) {
    if (!config?.translate) {
      mapProjection.translate([width / 2, height / 2])
    }
  } else if (!config?.fitSize) {
    mapProjection.fitSize([width, height], geoJson)
  }

  applyModifiers(mapProjection, config)

  return mapProjection
}

/**
 * Normalizes input map data to GeoJSON features.
 *
 * - TopoJSON is converted via `topojson-client`.
 * - If provided, `dataTransformer` is applied to the feature array.
 */
export function makeFeatures(
  geoData: MapData,
  dataTransformer?: DataTransformer,
): [ features: MapFeature[], geoJson: FeatureCollection ] {
  let geoJson: FeatureCollection
  if (isTopology(geoData)) {
    const topoObject = getTopoObject(geoData)
    const normalizedGeoJson = feature(geoData, topoObject)
    geoJson = normalizedGeoJson.type === 'FeatureCollection'
      ? normalizedGeoJson
      : { type: 'FeatureCollection', features: [normalizedGeoJson] }
  } else {
    geoJson = geoData
  }

  const features = dataTransformer ? dataTransformer(geoJson.features) : geoJson.features
  return [features, geoJson]
}

export const makePathFn = (mapProjection: GeoProjection): GeoPath => geoPath().projection(mapProjection)

/**
 * Returns a TopoJSON mesh when topology data is provided.
 */
export function makeMesh(geoData: MapData): MultiLineString | undefined {
  if (!isTopology(geoData)) return undefined

  const topoObject = getTopoObject(geoData)
  return mesh(geoData, topoObject)
}

/**
 * Creates a full {@link MapContext} from a {@link MapConfig}.
 */
export function makeMapContext({
  width = 600,
  height: passedHeight,
  aspectRatio = 16 / 9,
  data,
  dataTransformer,
  projection: providedProjection = geoEqualEarth,
  projectionConfig,
}: MapConfig): MapContext {
  const [features, geoJson] = makeFeatures(data, dataTransformer)
  const mapMesh = makeMesh(data)
  const height = passedHeight || (width / aspectRatio)
  const projection = makeProjection({
    width,
    height,
    projection: providedProjection,
    config: projectionConfig,
    geoJson,
  })

  const pathFn = makePathFn(projection)

  return {
    width,
    height,
    projection,
    features,
    mesh: mapMesh,
    path: pathFn,
    renderPath: (feature: Feature) => pathFn(feature),
    renderMesh: () => mapMesh ? pathFn(mapMesh) : null,
  }
}

/**
 * Type guard for TopoJSON topology inputs.
 */
export function isTopology(data: MapData): data is Topology {
  return (data as Topology)?.type === 'Topology'
}

export function getTopoObject(geoData: Topology): GeometryObject {
  const objectKey = Object.keys(geoData.objects)[0]
  return geoData.objects[objectKey] as GeometryObject
}
