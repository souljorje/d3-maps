import type {
  ExtendedFeatureCollection,
  GeoPath,
  GeoProjection,
} from 'd3-geo'
import type { GeometryObject, Topology } from 'topojson-specification'

import type { MapFeature } from './feature'
import type {
  MethodsToModifiers,
} from './utils'

import {
  geoNaturalEarth1,
  geoPath,
} from 'd3-geo'
import {
  feature,
  mesh,
} from 'topojson-client'

import { applyModifiers } from './utils'

export type MapMesh = ReturnType<typeof mesh>

export type MapData = ExtendedFeatureCollection | Topology
export type DataTransformer = (features: MapFeature[]) => MapFeature[]

/**
 * Extra projection method calls to apply before rendering.
 *
 * Use projection method names as keys and method arguments as values.
 * Example: `{ center: [[0, 20]], rotate: [[0, 0, 0]], scale: 160 }`
 *
 * @see https://d3js.org/d3-geo/projection
 */
export interface ProjectionConfig
  extends Omit<MethodsToModifiers<GeoProjection>, 'invert' | 'stream'> {}

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
   * Example: `geoNaturalEarth1`.
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
  path: GeoPath
  renderMesh: () => ReturnType<GeoPath>
}

/**
 * Creates a configured projection and fits it to the provided GeoJSON (if present).
 */
export function makeProjection({
  width,
  height,
  config = {},
  projection,
}: {
  width: number
  height: number
  config?: ProjectionConfig
  projection: () => GeoProjection
}): GeoProjection {
  const mapProjection = projection()
  const { fitExtent, fitSize, fitWidth, fitHeight, precision } = config

  if (!(fitExtent || fitSize || fitWidth || fitHeight)) {
    mapProjection.fitExtent([[1, 1], [width - 1, height - 1]], { type: 'Sphere' })
  }

  if (!precision) {
    mapProjection.precision(0.2)
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
): MapFeature[] {
  let geoJson: ExtendedFeatureCollection
  if (isTopology(geoData)) {
    const topoObject = getTopoObject(geoData)
    const normalizedGeoJson = feature(geoData, topoObject)
    geoJson = (normalizedGeoJson.type === 'FeatureCollection'
      ? normalizedGeoJson
      : { type: 'FeatureCollection', features: [normalizedGeoJson] }) as ExtendedFeatureCollection
  } else {
    geoJson = geoData
  }

  return dataTransformer ? dataTransformer(geoJson.features) : geoJson.features
}

/**
 * Returns a TopoJSON mesh when topology data is provided.
 */
export function makeMesh(geoData: MapData): MapMesh | undefined {
  if (!isTopology(geoData)) return undefined

  const topoObject = getTopoObject(geoData)
  return mesh(geoData, topoObject) as MapMesh
}

/**
 * Creates a full {@link MapContext} from a {@link MapConfig}.
 */
export function makeMapContext({
  width = 600,
  height: passedHeight,
  aspectRatio = 2 / 1,
  data,
  dataTransformer,
  projection: providedProjection = geoNaturalEarth1,
  projectionConfig,
}: MapConfig): MapContext {
  const features = makeFeatures(data, dataTransformer)

  const height = passedHeight || (width / aspectRatio)
  const projection = makeProjection({
    width,
    height,
    projection: providedProjection,
    config: projectionConfig,
  })

  const pathFn = geoPath().projection(projection)
  const mapMesh = makeMesh(data)

  return {
    width,
    height,
    projection,
    features,
    path: pathFn,
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
