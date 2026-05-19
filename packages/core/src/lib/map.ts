import type {
  GeoPath,
  GeoPermissibleObjects,
  GeoProjection,
  GeoSphere,
} from 'd3-geo'
import type { GeometryCollection } from 'geojson'

import type {
  MapData,
  MapDataRef,
  MapDataSource,
  MapDataTransformer,
} from './data'
import type { MapObjectData } from './mapObject'
import type { MethodsToModifiers } from './utils'

import {
  geoNaturalEarth1,
  geoPath,
} from 'd3-geo'

import {
  isFeature,
  resolveMapData,
} from './data'
import { makeMapObjects } from './mapObject'
import { applyModifiers } from './utils'

export type MapFit =
  | 'data'
  | 'sphere'
  | 'manual'
  | MapDataSource

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
   * Padding used by the built-in fit modes when explicit fit methods are not provided.
   */
  padding?: number
}

/**
 * Shared props contract for the `Map` component.
 *
 * In adapters, this is usually passed as component props.
 */
export interface MapProps extends MapDataRef {
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
   * Built-in fit source. Defaults to `data` when present, otherwise sphere.
   */
  fit?: MapFit
  /**
   * TopoJSON object key used when `fit` is an explicit topology.
   */
  fitObjectKey?: string
  /**
   * Optional normalized-object transformer (filter/augment/normalize objects).
   */
  dataTransformer?: MapDataTransformer
}

/**
 * Fully computed, framework-agnostic map context.
 *
 * Adapters provide this context to child layers (objects, markers, custom SVG).
 */
export interface MapContext extends MapDataRef {
  /**
   * Resolved SVG width used by the map.
   */
  width: number
  /**
   * Resolved SVG height used by the map.
   */
  height: number
  /**
   * Normalized object data after the map-level data transformer is applied.
   */
  objectData: MapData
  /**
   * Configured projection instance shared by map layers.
   */
  projection: GeoProjection
  /**
   * Render-ready GeoJSON objects for the current map.
   */
  objects: MapObjectData[]
  /**
   * Shared path generator bound to the map projection.
   */
  path: GeoPath
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
  fit = SPHERE,
}: {
  width: number
  height: number
  config?: ProjectionConfig
  projection: () => GeoProjection
  fit?: GeoPermissibleObjects | 'manual'
}): GeoProjection {
  const mapProjection = projection()

  const {
    padding = FIT_PADDING,
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
  } else if (fit !== 'manual') {
    mapProjection.fitExtent(
      [
        [padding, padding],
        [width - padding, height - padding],
      ],
      fit,
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
 * Creates a full {@link MapContext} from a {@link MapProps}.
 */
export function makeMapContext({
  width = DEFAULT_WIDTH,
  height: passedHeight,
  aspectRatio = DEFAULT_ASPECT_RATIO,
  data,
  objectKey,
  fit,
  fitObjectKey,
  dataTransformer,
  projection: providedProjection = geoNaturalEarth1,
  projectionConfig,
}: MapProps = {}): MapContext {
  const objectData: MapData = data == null
    ? []
    : resolveMapData(data, objectKey, dataTransformer)
  const height = passedHeight ?? width / aspectRatio
  const projection = makeProjection({
    width,
    height,
    projection: providedProjection,
    config: projectionConfig,
    fit: resolveFitTarget({
      objectData,
      fit,
      fitObjectKey,
    }),
  })

  const pathFn = geoPath().projection(projection)
  const objects = makeMapObjects(objectData, pathFn)

  return {
    width,
    height,
    data,
    objectKey,
    objectData,
    projection,
    objects,
    path: pathFn,
  }
}

function resolveFitTarget({
  objectData,
  fit,
  fitObjectKey,
}: {
  objectData: MapData
  fit?: MapFit
  fitObjectKey?: string
}): GeoPermissibleObjects | 'manual' {
  if (fit === 'manual') {
    return 'manual'
  }

  if (fit === 'sphere') {
    return SPHERE
  }

  if (fit === 'data') {
    return toGeometryCollection(objectData)
  }

  if (fit != null) {
    return toGeometryCollection(resolveMapData(fit, fitObjectKey))
  }

  if (objectData.length > 0) {
    return toGeometryCollection(objectData)
  }

  return SPHERE
}

function toGeometryCollection(
  items: MapData,
): GeometryCollection {
  return {
    type: 'GeometryCollection',
    geometries: items.flatMap((item) => {
      if (isFeature(item)) {
        return item.geometry ? [item.geometry] : []
      }

      return [item]
    }),
  }
}
