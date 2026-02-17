import type { GeoPath, GeoProjection } from 'd3-geo'
import type {
  Feature,
  FeatureCollection,
} from 'geojson'
import type { Topology } from 'topojson-specification'

import type { MapFeature } from './feature'

import {
  geoEqualEarth,
  geoPath,
} from 'd3-geo'
import { feature } from 'topojson-client'

import { isNumber } from './utils'

export type MapData = FeatureCollection | Topology
export type DataTransformer = (features: MapFeature[]) => MapFeature[]

/**
 * Configuration for a d3-geo projection.
 *
 * d3-maps applies these options (if provided) before fitting the geometry to the map size.
 */
export interface ProjectionConfig {
  center?: [number, number]
  rotate?: [number, number, number]
  scale?: number
}

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
  renderPath: (feature: Feature) => ReturnType<GeoPath>
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

  if (config?.center) {
    const [cx, cy] = config.center
    if (isNumber(cx) && isNumber(cy)) {
      mapProjection.center([cx, cy])
    }
  }
  if (config?.rotate) {
    const [rx, ry, rz] = config.rotate
    if (isNumber(rx) && isNumber(ry)) {
      mapProjection.rotate([rx, ry, isNumber(rz) ? rz : 0])
    }
  }
  if (config && isNumber(config.scale)) {
    mapProjection.scale(config.scale)
  }

  if (geoJson) {
    mapProjection.fitSize([width, height], geoJson)
  } else {
    mapProjection.translate([width / 2, height / 2])
  }

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
    const objectKey = Object.keys(geoData.objects)[0]
    if (objectKey) {
      const topoObject = geoData.objects[objectKey]
      const normalizedGeoJson = feature(geoData, topoObject)
      geoJson = normalizedGeoJson.type === 'FeatureCollection'
        ? normalizedGeoJson
        : { type: 'FeatureCollection', features: [normalizedGeoJson] }
    } else {
      geoJson = { type: 'FeatureCollection', features: [] }
    }
  } else {
    geoJson = geoData
  }

  const features = dataTransformer ? dataTransformer(geoJson.features) : geoJson.features
  return [features, geoJson]
}

export const makePathFn = (mapProjection: GeoProjection): GeoPath => geoPath().projection(mapProjection)

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
    path: pathFn,
    renderPath: (feature: Feature) => pathFn(feature),
  }
}

/**
 * Type guard for TopoJSON topology inputs.
 */
export function isTopology(data: MapData): data is Topology {
  return (data as Topology)?.type === 'Topology'
}
