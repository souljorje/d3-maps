import type { MapObjectStyles } from './mapObject'
import { isStringOrNumber } from './utils'

import type { Feature } from 'geojson'

export type MapFeature = (Feature & Record<string, unknown>) | Feature

export interface MapFeatureProps<TStyle = unknown> {
  data: MapFeature
  styles?: MapObjectStyles<TStyle>
  fill?: string
  stroke?: string
}

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
