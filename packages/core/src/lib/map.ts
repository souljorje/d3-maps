import type {
  GeoPath,
  GeoPermissibleObjects,
  GeoProjection,
  GeoSphere,
} from 'd3-geo'
import type { GeometryCollection } from 'geojson'

import type {
  MapData,
  MapFeatureData,
} from './data'
import type { MethodsToModifiers } from './utils'

import {
  geoNaturalEarth1,
  geoPath,
} from 'd3-geo'

import {
  isFeature,
  resolveMapData,
} from './data'
import { applyModifiers, isObject } from './utils'

export type MapFit =
  | 'sphere'
  | 'manual'
  | MapData

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
}

export interface MapProjectionProps {
  width: number
  height: number
  /**
   * Projection factory from d3-geo (or a compatible implementation).
   *
   * Example: `geoNaturalEarth1`.
   */
  projection: () => GeoProjection
  /**
   * Projection method arguments passed to the created projection
   */
  config?: ProjectionConfig
  /**
   * Built-in fit source. Defaults to sphere.
   */
  fit?: MapFit
  /**
   * TopoJSON object key used when `fit` is an explicit topology.
   */
  fitObjectKey?: string
  /**
   * Padding used by the built-in `fit` when explicit fit methods are not provided.
   */
  padding?: number
}

/**
 * Shared props contract for the `Map` component.
 */
export interface MapProps extends Partial<MapProjectionProps> {
  aspectRatio?: number
  projectionConfig?: ProjectionConfig
}

/**
 * Fully computed, framework-agnostic map context.
 * Adapters provide this context to child layers.
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
   * Shared path generator bound to the map projection.
   */
  path: GeoPath
}

const DEFAULT_WIDTH = 600
const DEFAULT_ASPECT_RATIO = 2 / 1
const DEFAULT_PRECISION = 0.2
const FIT_PADDING = 1

export const SPHERE = { type: 'Sphere' } as const satisfies GeoSphere

/**
 * Creates a configured projection and resolves its fit target.
 */
export function makeProjection({
  width,
  height,
  config = {},
  projection,
  fit,
  fitObjectKey,
  padding = FIT_PADDING,
}: MapProjectionProps): GeoProjection {
  const mapProjection = projection()

  const {
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

  if (fit === 'manual') {
    applyModifiers(mapProjection, {
      fitExtent,
      fitSize,
      fitWidth,
      fitHeight,
    })
  } else {
    mapProjection.fitExtent(
      [
        [padding, padding],
        [width - padding, height - padding],
      ],
      resolveFitTarget(fit, fitObjectKey),
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
 * Creates a full {@link MapContext} from a {@link MapProps}
 */
export function makeMapContext({
  width = DEFAULT_WIDTH,
  height: passedHeight,
  aspectRatio = DEFAULT_ASPECT_RATIO,
  projection: projectionFactory = geoNaturalEarth1,
  projectionConfig,
  ...projectionProps
}: MapProps = {}): MapContext {
  const height = passedHeight ?? width / aspectRatio
  const projection = makeProjection({
    width,
    height,
    projection: projectionFactory,
    config: projectionConfig,
    ...projectionProps,
  })

  return {
    width,
    height,
    projection,
    path: geoPath().projection(projection),
  }
}

function resolveFitTarget(
  fit?: Exclude<MapFit, 'manual'>,
  fitObjectKey?: string,
): GeoPermissibleObjects {
  if (isObject(fit)) {
    return toGeometryCollection(resolveMapData(fit as MapData, fitObjectKey))
  }
  return SPHERE
}

function toGeometryCollection(
  items: readonly MapFeatureData[],
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
