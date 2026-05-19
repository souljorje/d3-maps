import type * as GeoJSON from 'geojson'
import type { Topology } from 'topojson-specification'

import { feature } from 'topojson-client'

import {
  isObject,
} from './utils'

export type MapDataSource = GeoJSON.GeoJSON | Topology
export type MapDataItem = GeoJSON.Feature | GeoJSON.Geometry
export type MapData = readonly MapDataItem[]
export interface MapDataRef {
  data?: MapDataSource
  objectKey?: string
}
export type MapDataTransformer = (
  objects: MapData,
) => MapData

export function isFeature(data: MapDataItem): data is GeoJSON.Feature {
  return data.type === 'Feature'
}

/**
 * Type guard for TopoJSON topology inputs.
 */
export function isTopology(data: unknown): data is Topology {
  return isObject(data) && data.type === 'Topology'
}

export function normalizeMapData(
  data: MapDataSource,
  objectKey?: string,
): MapData {
  const geoJson = isTopology(data)
    ? topologyToGeoJson(data, objectKey)
    : data

  return makeObjectsFromGeoJson(geoJson)
}

export function resolveMapData(
  data: MapDataSource,
  objectKey?: string,
  dataTransformer?: MapDataTransformer,
): MapData {
  const objects = normalizeMapData(data, objectKey)
  return dataTransformer?.([...objects]) ?? objects
}

export function resolveMapDataRef(
  local?: MapDataRef,
  shared?: MapDataRef,
): [MapDataSource | undefined, string | undefined] {
  return [
    local?.data ?? shared?.data,
    local?.objectKey ?? shared?.objectKey,
  ]
}

function topologyToGeoJson(
  topology: Topology,
  objectKey: string = Object.keys(topology.objects)[0] ?? '',
): GeoJSON.Feature | GeoJSON.FeatureCollection {
  return feature(topology, objectKey)
}

function makeObjectsFromGeoJson(
  geoJson: GeoJSON.GeoJSON,
): MapData {
  switch (geoJson.type) {
    case 'FeatureCollection':
      return geoJson.features

    case 'GeometryCollection':
      return geoJson.geometries

    default:
      return [geoJson]
  }
}
