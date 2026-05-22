import type { MapData, MapFeatureData } from './data'
import type { MapElementProps } from './element'
import type { MapContext } from './map'

import { isFeature, resolveMapData } from './data'
import { isStringOrNumber } from './utils'

export type MapFeatureKey = string | number

export type MapFeatureExtension<T> = MapFeatureData & T

export type MapFeatureRendered<T extends MapFeatureData = MapFeatureData> = T & {
  key: MapFeatureKey
  d?: string
}

export type MapFeatureTransformer<T extends MapFeatureData = MapFeatureData> = (
  features: readonly MapFeatureData[],
) => readonly T[]

export type MapFeatureKeyAccessor<T extends MapFeatureData = MapFeatureData> = (
  item: T,
  index: number,
) => MapFeatureKey | undefined

export interface MapFeatureProps<TStyle = unknown> extends MapElementProps<TStyle> {
  d?: string
}

export interface MapFeaturesProps<
  TFeature extends MapFeatureData = MapFeatureData,
  TStyle = unknown,
> extends MapElementProps<TStyle> {
  data?: MapData
  transformer?: MapFeatureTransformer<TFeature>
  getKey?: MapFeatureKeyAccessor<NoInfer<TFeature>>
  objectKey?: string
}

export function getFeatureKey(
  item: MapFeatureData,
  index: number,
): MapFeatureKey {
  if ('id' in item && isStringOrNumber(item.id)) return item.id

  if (isFeature(item)) {
    const id = item.properties?.id
    if (isStringOrNumber(id)) return id

    const name = item.properties?.name
    if (isStringOrNumber(name)) return name
  }

  return index
}

export function makeMapFeatures<TFeature extends MapFeatureData = MapFeatureData>(
  context: Pick<MapContext, 'path'>,
  {
    data,
    objectKey,
    transformer,
    getKey,
  }: {
    data?: MapData
    objectKey?: string
    transformer?: MapFeatureTransformer<TFeature>
    getKey?: MapFeatureKeyAccessor<TFeature>
  },
): MapFeatureRendered<TFeature>[] {
  if (data == null) return []

  const features = resolveMapData(data, objectKey)
  const items = transformer
    ? transformer(features)
    : features as readonly TFeature[]

  return items.map((item, index) => ({
    ...item,
    key: getKey?.(item, index) ?? getFeatureKey(item, index),
    d: context.path(item) ?? undefined,
  }))
}
