import type * as GeoJSON from 'geojson'

import type { MapData, MapFeatureData } from './data'
import type { MapElementProps } from './element'
import type { MapContext } from './map'

import { isFeature, resolveMapData } from './data'
import { isStringOrNumber } from './utils'

export type MapFeatureKey = string | number

export type MapFeatureNormalized = GeoJSON.Feature<
  GeoJSON.Geometry | null,
  Record<string, unknown>
>

export type MapFeatureRendered<TExtra extends object = object> = MapFeatureNormalized & TExtra & {
  key: MapFeatureKey
  d?: string
}

export type MapFeatureTransformer<TExtra extends object = object> = (
  features: readonly MapFeatureNormalized[],
) => readonly (MapFeatureNormalized & TExtra)[]

export type MapFeatureKeyAccessor<TExtra extends object = object> = (
  item: MapFeatureNormalized & TExtra,
  fallback: string | number,
) => MapFeatureKey | undefined

export interface MapFeatureProps<TStyle = unknown> extends MapElementProps<TStyle> {
  d?: string
}

export interface MapFeaturesProps<
  TExtra extends object = object,
  TStyle = unknown,
> extends MapElementProps<TStyle> {
  data?: MapData
  transformer?: MapFeatureTransformer<TExtra>
  getKey?: MapFeatureKeyAccessor<NoInfer<TExtra>>
  objectKey?: string
}

export function getFeatureKey(
  item: MapFeatureData,
  fallback: string | number,
): MapFeatureKey {
  if ('id' in item && isStringOrNumber(item.id)) return item.id

  if (isFeature(item)) {
    const id = item.properties?.id
    if (isStringOrNumber(id)) return id

    const name = item.properties?.name
    if (isStringOrNumber(name)) return name
  }

  return fallback
}

export function makeMapFeatures<TExtra extends object = object>(
  context: Pick<MapContext, 'path'>,
  {
    data,
    objectKey,
    transformer,
    getKey,
  }: {
    data?: MapData
    objectKey?: string
    transformer?: MapFeatureTransformer<TExtra>
    getKey?: MapFeatureKeyAccessor<TExtra>
  },
): MapFeatureRendered<TExtra>[] {
  if (data == null) return []

  const features = resolveMapData(data, objectKey).map(normalizeMapFeature)
  const items = (transformer
    ? transformer(features)
    : features) as readonly (MapFeatureNormalized & TExtra)[]

  return items.map((item, index) => ({
    ...item,
    key: getKey?.(item, index) ?? getFeatureKey(item, index),
    d: context.path(item) ?? undefined,
  }))
}

function normalizeMapFeature(item: MapFeatureData): MapFeatureNormalized {
  if (isFeature(item)) {
    return {
      ...item,
      properties: item.properties ?? {},
    }
  }
  return {
    type: 'Feature',
    geometry: item,
    properties: {},
  }
}
