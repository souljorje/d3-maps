import type { GeoPath } from 'd3-geo'

import type {
  MapDataItem,
  MapDataRef,
  MapDataTransformer,
} from './data'
import type { InteractiveProps } from './interaction'

import { isFeature } from './data'
import { isStringOrNumber } from './utils'

export type MapObjectData<T extends MapDataItem = MapDataItem> = T & {
  key: string | number
  d?: string
}
export type MapObjectKey = string | number
export type MapObjectKeyAccessor<T extends MapDataItem = MapDataItem> = (
  item: T,
  index: number,
) => MapObjectKey | undefined

export interface MapObjectProps<TStyle = unknown> extends InteractiveProps<TStyle> {}

export interface MapDataObjectProps<TStyle = unknown>
  extends MapObjectProps<TStyle>, MapDataRef {}

export interface MapObjectsProps<TStyle = unknown>
  extends MapDataObjectProps<TStyle> {
  dataTransformer?: MapDataTransformer
  getKey?: MapObjectKeyAccessor
}

export function getMapObjectKey(
  item: MapDataItem,
  index: number,
): MapObjectKey {
  if ('id' in item && isStringOrNumber(item.id)) return item.id

  if (isFeature(item)) {
    const id = item.properties?.id
    if (isStringOrNumber(id)) return id

    const name = item.properties?.name
    if (isStringOrNumber(name)) return name
  }

  return index
}

export function makeMapObjects<T extends MapDataItem>(
  items: readonly T[],
  path: GeoPath,
  getKey: MapObjectKeyAccessor<T> = getMapObjectKey,
): MapObjectData<T>[] {
  return items.map((item, index): MapObjectData<T> => ({
    ...item,
    key: getKey(item, index) ?? index,
    d: path(item) ?? undefined,
  }))
}
