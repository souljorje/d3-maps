import type {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
} from 'geojson'

import type { MapGeometryData } from './geometry'
import type { MapObjectProps } from './mapObject'

import { isStringOrNumber } from './utils'

/**
 * A GeoJSON Feature used by d3-maps.
 *
 * This type allows extra top-level fields to be attached in `dataTransformer` (e.g. choropleth colors).
 */
export type MapFeatureData =
  & Feature<MapGeometryData | null, GeoJsonProperties>
  & Record<string, unknown>

export type MapFeatureCollectionData =
  & Omit<FeatureCollection<MapGeometryData | null, GeoJsonProperties>, 'features'>
  & { features: MapFeatureData[] }
  & Record<string, unknown>

/**
 * Shared props contract for feature collections rendered from the current map context.
 */
export interface MapFeaturesProps<TStyle = unknown> extends MapObjectProps<TStyle> {}

/**
 * Resolves a stable key for a feature.
 *
 * Checks:
 * 1) `feature[idKey]`
 * 2) `feature.properties[idKey]`
 * 3) optional fallback value
 */
export function getFeatureKey(
  feature: MapFeatureData,
  idKey: string = 'id',
  fallback?: number | string,
): string | number | undefined {
  const directValue = feature[idKey as keyof MapFeatureData]
  if (isStringOrNumber(directValue)) return directValue

  const propertyValue = feature.properties?.[idKey]
  if (isStringOrNumber(propertyValue)) return propertyValue

  return fallback
}
