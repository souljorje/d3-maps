import type {
  GeoPath,
  GeoPermissibleObjects,
  GeoProjection,
  GeoSphere,
} from 'd3-geo'
import type { GeometryObject, Topology } from 'topojson-specification'

import type {
  MapFeatureCollectionData,
  MapFeatureData,
} from './feature'
import type {
  MapGeometryCollectionData,
  MapGeometryData,
} from './geometry'
import type { MethodsToModifiers } from './utils'

import {
  geoNaturalEarth1,
  geoPath,
} from 'd3-geo'
import {
  feature,
  mesh,
} from 'topojson-client'

import { getFeatureKey } from './feature'
import { applyModifiers, isObject } from './utils'

export type MapMeshData = ReturnType<typeof mesh>
export type ProjectionFit = 'sphere' | 'features' | 'object'

export type MapGeoJsonData =
  | MapGeometryData
  | MapGeometryCollectionData
  | MapFeatureData
  | MapFeatureCollectionData
export type MapTopologyData = Topology
export type MapDataItem = MapGeoJsonData | MapTopologyData
export type MapData = MapDataItem | MapDataItem[]
export type DataTransformer = (features: MapFeatureData[]) => MapFeatureData[]

type FlatMapObjectData = MapFeatureData | MapGeometryData

/**
 * Precomputed render unit for a GeoJSON feature.
 */
export interface RenderedFeature {
  /**
   * Stable render key derived from feature identity.
   */
  key: string | number
  /**
   * Original feature data.
   */
  data: MapFeatureData
  /**
   * Feature properties for ergonomic slot/render access.
   */
  properties: MapFeatureData['properties']
  /**
   * Precomputed SVG path string for the feature.
   */
  d?: string
}

/**
 * Precomputed render unit for a non-feature geometry.
 */
export interface RenderedGeometry {
  /**
   * Stable render key for the geometry.
   */
  key: number
  /**
   * Original geometry data.
   */
  data: MapGeometryData
  /**
   * Precomputed SVG path string for the geometry.
   */
  d?: string
}

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
   * - `features`: fit the normalized feature collection
   * - `object`: fit the provided `fitObject`
   */
  fit?: ProjectionFit
  /**
   * GeoJSON object to fit when `fit` is set to `object`.
   */
  fitObject?: GeoPermissibleObjects
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
   * TopoJSON is automatically converted to GeoJSON features and geometries.
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
 * Adapters provide this context to child layers (features, geometries, markers, custom SVG).
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
   * Render-ready feature units for the current map.
   */
  features: RenderedFeature[]
  /**
   * Render-ready non-feature geometry units for the current map.
   */
  geometries: RenderedGeometry[]
  /**
   * Shared path generator bound to the map projection.
   */
  path: GeoPath
  /**
   * Renders a TopoJSON mesh path when one is available.
   */
  renderMesh: () => string | null
}

const DEFAULT_WIDTH = 600
const DEFAULT_ASPECT_RATIO = 2 / 1
const DEFAULT_PRECISION = 0.2
const FIT_PADDING = 1

const SPHERE = { type: 'Sphere' } as const satisfies GeoSphere

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
    fitObject,
    fitExtent,
    fitSize,
    fitWidth,
    fitHeight,
    scale,
    translate,
    clipExtent,
    precision = DEFAULT_PRECISION,
    ...preFitConfig
  } = config

  applyModifiers(mapProjection, preFitConfig)

  const hasExplicitFit =
    fitExtent != null
    || fitSize != null
    || fitWidth != null
    || fitHeight != null

  if (hasExplicitFit) {
    applyModifiers(mapProjection, {
      fitExtent,
      fitSize,
      fitWidth,
      fitHeight,
    })
  } else {
    mapProjection.fitExtent(
      [
        [FIT_PADDING, FIT_PADDING],
        [width - FIT_PADDING, height - FIT_PADDING],
      ],
      resolveFitTarget(fit, fitObject, features),
    )
  }

  applyModifiers(mapProjection, {
    scale,
    translate,
    clipExtent,
    precision,
  })

  return mapProjection
}

/**
 * Returns a TopoJSON mesh when topology data is provided.
 */
export function makeMesh(geoData: MapData, topologyObjectKey?: string): MapMeshData | undefined {
  const topologyItems = getMapDataItems(geoData).filter(isTopology)

  if (topologyItems.length !== 1) return undefined

  const topology = topologyItems[0]
  const topoObject = getTopoObject(topology, topologyObjectKey)
  return mesh(topology, topoObject) as MapMeshData
}

/**
 * Creates a full {@link MapContext} from a {@link MapProps}.
 */
export function makeMapContext({
  width = DEFAULT_WIDTH,
  height: passedHeight,
  aspectRatio = DEFAULT_ASPECT_RATIO,
  data,
  topologyObjectKey,
  dataTransformer,
  projection: providedProjection = geoNaturalEarth1,
  projectionConfig,
}: MapProps): MapContext {
  const { features: rawFeatures, geometries: geometryData } = normalizeMapData(data, topologyObjectKey)
  const featureData = dataTransformer?.(rawFeatures) ?? rawFeatures
  const height = passedHeight ?? width / aspectRatio
  const projection = makeProjection({
    width,
    height,
    projection: providedProjection,
    config: projectionConfig,
    features: featureData,
  })

  const pathFn = geoPath().projection(projection)
  const mapMesh = makeMesh(data, topologyObjectKey)
  const meshPath = mapMesh ? pathFn(mapMesh) : null
  const { features, geometries } = makeRenderedMapData(featureData, geometryData, pathFn)

  return {
    width,
    height,
    projection,
    features,
    geometries,
    path: pathFn,
    renderMesh: () => meshPath,
  }
}

/**
 * Type guard for TopoJSON topology inputs.
 */
export function isTopology(data: unknown): data is Topology {
  return isObject(data) && data.type === 'Topology'
}

function normalizeMapData(
  geoData: MapData,
  topologyObjectKey?: string,
): {
  features: MapFeatureData[]
  geometries: MapGeometryData[]
} {
  const features: MapFeatureData[] = []
  const geometries: MapGeometryData[] = []

  for (const item of getMapDataItems(geoData)) {
    for (const object of makeObjectsFromItem(item, topologyObjectKey)) {
      if (object.type === 'Feature') {
        features.push(object as MapFeatureData)
      } else {
        geometries.push(object)
      }
    }
  }

  return { features, geometries }
}

function makeRenderedMapData(
  featuresData: MapFeatureData[],
  geometryData: MapGeometryData[],
  path: GeoPath,
): {
  features: RenderedFeature[]
  geometries: RenderedGeometry[]
} {
  return {
    features: featuresData.map((data, index): RenderedFeature => ({
      key: getFeatureKey(data, 'id', index) ?? index,
      data,
      properties: data.properties,
      d: path(data) ?? undefined,
    })),

    geometries: geometryData.map((data, index): RenderedGeometry => ({
      key: index,
      data,
      d: path(data) ?? undefined,
    })),
  }
}

export function makeObjectsFromItem(
  item: MapDataItem,
  topologyObjectKey?: string,
): FlatMapObjectData[] {
  const geoJson = isTopology(item)
    ? topologyToGeoJson(item, topologyObjectKey)
    : item
  return makeObjectsFromGeoJson(geoJson)
}

export function getTopoObject(geoData: Topology, topologyObjectKey?: string): GeometryObject {
  const objectKey = topologyObjectKey ?? Object.keys(geoData.objects)[0]
  const object = geoData.objects[objectKey]

  if (!object) {
    throw new Error(`Topology object "${objectKey ?? ''}" not found`)
  }

  return object as GeometryObject
}

function resolveFitTarget(
  fit: ProjectionFit | undefined,
  fitObject: GeoPermissibleObjects | undefined,
  features: MapFeatureData[],
): GeoPermissibleObjects {
  if (fit === 'object') {
    if (!fitObject) {
      throw new Error('projectionConfig.fitObject is required when projectionConfig.fit is "object"')
    }

    return fitObject
  }

  if (fit === 'features') {
    if (features.length === 0) {
      throw new Error('projectionConfig.fit "features" requires at least one feature')
    }

    return {
      type: 'FeatureCollection',
      features,
    } satisfies MapFeatureCollectionData
  }

  return SPHERE
}

function getMapDataItems(geoData: MapData): MapDataItem[] {
  return Array.isArray(geoData) ? geoData : [geoData]
}

function topologyToGeoJson(
  topology: Topology,
  topologyObjectKey?: string,
): MapFeatureData | MapFeatureCollectionData {
  const topoObject = getTopoObject(topology, topologyObjectKey)
  const geoJson = feature(topology, topoObject)

  return geoJson.type === 'FeatureCollection'
    ? geoJson as MapFeatureCollectionData
    : geoJson as MapFeatureData
}

function makeObjectsFromGeoJson(geoJson: MapGeoJsonData): FlatMapObjectData[] {
  switch (geoJson.type) {
    case 'FeatureCollection':
      return geoJson.features

    case 'GeometryCollection':
      return geoJson.geometries

    default:
      return [geoJson]
  }
}
