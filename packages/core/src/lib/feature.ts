import type { Feature } from 'geojson'

import type { MapObjectStyles } from './mapObject'

import { isStringOrNumber } from './utils'

/**
 * A GeoJSON Feature used by d3-maps.
 *
 * This type allows extra top-level fields to be attached in `dataTransformer` (e.g. choropleth colors).
 */
export type MapFeature = (Feature & Record<string, unknown>) | Feature

/**
 * Shared props contract for a single rendered feature.
 */
export interface MapFeatureProps<TStyle = unknown> {
  data: MapFeature
  styles?: MapObjectStyles<TStyle>
  fill?: string
  stroke?: string
}

/**
 * Resolves a stable key for a feature.
 *
 * Checks:
 * 1) `feature[idKey]`
 * 2) `feature.properties[idKey]`
 * 3) fallback to the list index
 */
export function getFeatureKey(
  feature: MapFeature,
  idKey = 'id',
  index: number,
): string | number {
  const directValue = feature[idKey as keyof MapFeature]
  if (isStringOrNumber(directValue)) return directValue

  const propertyValue = feature.properties?.[idKey]
  if (isStringOrNumber(propertyValue)) return propertyValue

  return index
}
