import type * as GeoJSON from 'geojson'
import type { Topology } from 'topojson-specification'

import type { MapContext } from './map'
import type { MapObjectProps } from './object'

import { feature } from 'topojson-client'

import { isObject, isStringOrNumber } from './utils'

export type MapData = GeoJSON.GeoJSON | Topology
export type MapFeatureData = GeoJSON.Feature | GeoJSON.Geometry
export type MapFeatureTransformer = (
  features: readonly MapFeatureData[],
) => readonly MapFeatureData[]

export type MapFeature<T extends MapFeatureData = MapFeatureData> = T & {
  key: string | number
  d?: string
}

export type MapFeatureKey = string | number

export type MapFeatureKeyAccessor<T extends MapFeatureData = MapFeatureData> = (
  item: T,
  index: number,
) => MapFeatureKey | undefined

export interface MapFeaturesProps<TStyle = unknown> extends MapObjectProps<TStyle> {
  data?: MapData
  transformer?: MapFeatureTransformer
  getKey?: MapFeatureKeyAccessor
  objectKey?: string
}

export function isFeature(data: MapFeatureData): data is GeoJSON.Feature {
  return data.type === 'Feature'
}

export function isTopology(data: unknown): data is Topology {
  return isObject(data) && data.type === 'Topology'
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

export function resolveMapData(
  data: MapData,
  objectKey?: string,
  transformer?: MapFeatureTransformer,
): readonly MapFeatureData[] {
  const geoJson = isTopology(data)
    ? topologyToGeoJson(data, objectKey)
    : data
  const features = makeObjectsFromGeoJson(geoJson)
  return transformer?.([...features]) ?? features
}

export function makeMapFeatures<T extends MapFeatureData = MapFeatureData>(
  context: Pick<MapContext, 'path'>,
  {
    data,
    objectKey,
    transformer,
    getKey = getFeatureKey as MapFeatureKeyAccessor<T>,
  }: {
    data?: MapData
    objectKey?: string
    transformer?: MapFeatureTransformer
    getKey?: MapFeatureKeyAccessor<T>
  },
): MapFeature<T>[] {
  if (data == null) return []

  const items = resolveMapData(
    data,
    objectKey,
    transformer,
  ) as readonly T[]

  return items.map((item, index): MapFeature<T> => ({
    ...item,
    key: getKey(item, index) ?? index,
    d: context.path(item) ?? undefined,
  }))
}

function topologyToGeoJson(
  topology: Topology,
  objectKey: string = Object.keys(topology.objects)[0] ?? '',
): GeoJSON.Feature | GeoJSON.FeatureCollection {
  return feature(topology, objectKey)
}

function makeObjectsFromGeoJson(
  geoJson: GeoJSON.GeoJSON,
): readonly MapFeatureData[] {
  switch (geoJson.type) {
    case 'FeatureCollection':
      return geoJson.features

    case 'GeometryCollection':
      return geoJson.geometries

    default:
      return [geoJson]
  }
}
