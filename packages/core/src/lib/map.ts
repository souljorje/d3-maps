import type {
  ExtendedFeatureCollection,
  GeoPath,
  GeoPermissibleObjects,
  GeoProjection,
} from 'd3-geo'
import type { GeometryObject, Topology } from 'topojson-specification'

import type { MapFeatureData } from './feature'
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

import { getFeatureKey } from './feature'
import { applyModifiers } from './utils'

export type MapMeshData = ReturnType<typeof mesh>
export type ProjectionFit = 'sphere' | 'features' | 'object'

export type MapDataItem = ExtendedFeatureCollection | Topology
export type MapData = MapDataItem | MapDataItem[]
export type DataTransformer = (features: MapFeatureData[]) => MapFeatureData[]

/**
 * Extra projection method calls to apply before rendering.
 * Use projection method names as keys and method arguments as values.
 *
 * Example: `{ center: [[0, 20]], rotate: [[0, 0, 0]], scale: 160 }`
 *
 * @see https://d3js.org/d3-geo/projection
 */
export interface ProjectionConfig
  extends Omit<MethodsToModifiers<GeoProjection>, 'invert' | 'stream'> {
  /**
   * Built-in fit target to use when explicit `fitExtent`, `fitSize`, `fitWidth`, or `fitHeight`
   * are not provided.
   *
   * - `sphere`: fit the full globe
   * - `features`: fit all normalized features
   * - `object`: fit a single normalized feature by id
   */
  fit?: ProjectionFit
  /**
   * Feature id used when `fit` is set to `object`.
   *
   * Resolved via `getFeatureKey(feature, 'id')`.
   */
  fitObjectId?: string
}

/**
 * Shared props contract for the `Map` component.
 *
 * In adapters, this is usually passed as component props.
 */
export interface MapProps {
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
   * Optional TopoJSON object key to use when `data` contains multiple objects.
   *
   * If omitted, the first object is used for backward compatibility.
   */
  topologyObjectKey?: string
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
  /**
   * Resolved SVG width used by the map.
   */
  width: number
  /**
   * Resolved SVG height used by the map.
   */
  height: number
  /**
   * Configured projection instance shared by map layers.
   */
  projection: GeoProjection
  /**
   * Normalized feature list after optional transformation.
   */
  features: MapFeatureData[]
  /**
   * Shared path generator bound to the map projection.
   */
  path: GeoPath
  /**
   * Renders a TopoJSON mesh path when one is available.
   */
  renderMesh: () => string | null
}

/**
 * Creates a configured projection and resolves its fit target.
 */
export function makeProjection({
  width,
  height,
  config = {},
  projection,
  features = [],
}: {
  width: number
  height: number
  config?: ProjectionConfig
  projection: () => GeoProjection
  features?: MapFeatureData[]
}): GeoProjection {
  const mapProjection = projection()
  const {
    fit,
    fitObjectId,
    fitExtent,
    fitSize,
    fitWidth,
    fitHeight,
    scale,
    translate,
    clipExtent,
    precision,
    ...preFitConfig
  } = config

  applyModifiers(mapProjection, preFitConfig)

  if (fitExtent || fitSize || fitWidth || fitHeight) {
    applyModifiers(mapProjection, {
      fitExtent,
      fitSize,
      fitWidth,
      fitHeight,
    })
  } else {
    mapProjection.fitExtent(
      [[1, 1], [width - 1, height - 1]],
      resolveFitTarget(fit, fitObjectId, features),
    )
  }

  applyModifiers(mapProjection, {
    scale,
    translate,
    clipExtent,
    precision: precision ?? 0.2,
  })

  return mapProjection
}

/**
 * Normalizes input map data to GeoJSON features.
 *
 * - TopoJSON is converted via `topojson-client`.
 * - Array input is flattened into one feature array.
 * - If provided, `dataTransformer` is applied once after flattening.
 */
export function makeFeatures(
  geoData: MapData,
  dataTransformer?: DataTransformer,
  topologyObjectKey?: string,
): MapFeatureData[] {
  const dataItems = Array.isArray(geoData) ? geoData : [geoData]
  const features = dataItems.flatMap((item) => makeFeaturesFromItem(item, topologyObjectKey))

  return dataTransformer ? dataTransformer(features) : features
}

/**
 * Returns a TopoJSON mesh when topology data is provided.
 */
export function makeMesh(geoData: MapData, topologyObjectKey?: string): MapMeshData | undefined {
  const dataItems = Array.isArray(geoData) ? geoData : [geoData]
  const topologyItems = dataItems.filter(isTopology)

  if (topologyItems.length !== 1) return undefined

  const topology = topologyItems[0]
  const topoObject = getTopoObject(topology, topologyObjectKey)
  return mesh(topology, topoObject) as MapMeshData
}

/**
 * Creates a full {@link MapContext} from a {@link MapProps}.
 */
export function makeMapContext({
  width = 600,
  height: passedHeight,
  aspectRatio = 2 / 1,
  data,
  topologyObjectKey,
  dataTransformer,
  projection: providedProjection = geoNaturalEarth1,
  projectionConfig,
}: MapProps): MapContext {
  const features = makeFeatures(data, dataTransformer, topologyObjectKey)

  const height = passedHeight || (width / aspectRatio)
  const projection = makeProjection({
    width,
    height,
    projection: providedProjection,
    config: projectionConfig,
    features,
  })

  const pathFn = geoPath().projection(projection)
  const mapMesh = makeMesh(data, topologyObjectKey)

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
export function isTopology(data: unknown): data is Topology {
  return (data as Topology)?.type === 'Topology'
}

export function makeFeaturesFromItem(
  item: MapDataItem,
  topologyObjectKey?: string,
): MapFeatureData[] {
  return isTopology(item)
    ? topologyToFeatures(item, topologyObjectKey)
    : item.features
}

export function topologyToFeatures(
  topology: Topology,
  topologyObjectKey?: string,
): MapFeatureData[] {
  const topoObject = getTopoObject(topology, topologyObjectKey)
  const normalizedGeoJson = feature(topology, topoObject)

  return normalizedGeoJson.type === 'FeatureCollection'
    ? normalizedGeoJson.features as MapFeatureData[]
    : [normalizedGeoJson as MapFeatureData]
}

export function getTopoObject(geoData: Topology, topologyObjectKey?: string): GeometryObject {
  const objectKey = topologyObjectKey || Object.keys(geoData.objects)[0]
  const object = geoData.objects[objectKey]
  if (!object) {
    throw new Error(
      `Topology object ${objectKey || ''} not found}`,
    )
  }
  return object as GeometryObject
}

function resolveFitTarget(
  fit: ProjectionFit | undefined,
  fitObjectId: string | undefined,
  features: MapFeatureData[],
): GeoPermissibleObjects {
  if (fit === 'features') {
    return features.length > 0
      ? makeFeatureCollection(features)
      : { type: 'Sphere' }
  }

  if (fit === 'object') {
    if (!fitObjectId) {
      throw new Error('projectionConfig.fitObjectId is required when projectionConfig.fit is "object"')
    }

    const feature = features.find((item) => getFeatureKey(item) === fitObjectId)
    if (!feature) {
      throw new Error(`Projection fit object "${fitObjectId}" not found`)
    }

    return feature
  }

  return { type: 'Sphere' }
}

function makeFeatureCollection(features: MapFeatureData[]): ExtendedFeatureCollection {
  return {
    type: 'FeatureCollection',
    features,
  }
}
