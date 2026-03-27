import type { ExtendedFeature } from 'd3-geo'

import type {
  MapObjectProps,
} from './mapObject'

import { isStringOrNumber } from './utils'

/**
 * A GeoJSON Feature used by d3-maps.
 *
 * This type allows extra top-level fields to be attached in `dataTransformer` (e.g. choropleth colors).
 */
export type MapFeatureData = (ExtendedFeature & Record<string, unknown>) | ExtendedFeature

/**
 * Shared props contract for a single rendered feature.
 */
export interface MapFeatureProps<TStyle = unknown> extends MapObjectProps<TStyle> {
  data: MapFeatureData
}

/**
 * Shared props contract for feature collections rendered from the current map context.
 */
export interface MapFeaturesProps<TStyle = unknown> extends Omit<MapFeatureProps<TStyle>, 'data'> {
  idKey?: string
}

/**
 * Resolves a stable key for a feature.
 *
 * Checks:
 * 1) `feature[idKey]`
 * 2) `feature.properties[idKey]`
 * 3) optional fallback value
 */
export function getFeatureKey(
  feature: MapFeature,
  idKey: string = 'id',
  fallback?: number | string,
): string | number | undefined {
  const directValue = feature[idKey as keyof MapFeature]
  if (isStringOrNumber(directValue)) return directValue

  const propertyValue = feature.properties?.[idKey]
  if (isStringOrNumber(propertyValue)) return propertyValue

  return fallback
}
