import type * as GeoJSON from 'geojson'
import type { Topology } from 'topojson-specification'

import { feature } from 'topojson-client'

import { isObject } from './utils'

export type MapData = GeoJSON.GeoJSON | Topology
export type MapFeatureData = GeoJSON.Feature<GeoJSON.Geometry | null> | GeoJSON.Geometry

export function isFeature(data: unknown): data is GeoJSON.Feature<GeoJSON.Geometry | null> {
  return isObject(data) && data.type === 'Feature'
}

export function isTopology(data: unknown): data is Topology {
  return isObject(data) && data.type === 'Topology'
}

export function resolveMapData(
  data: MapData,
  objectKey?: string,
): readonly MapFeatureData[] {
  const geoJson = isTopology(data)
    ? topologyToGeoJson(data, objectKey)
    : data
  return flattenGeoJson(geoJson)
}

function topologyToGeoJson(
  topology: Topology,
  objectKey: string = Object.keys(topology.objects)[0],
): GeoJSON.Feature | GeoJSON.FeatureCollection {
  return feature(topology, objectKey)
}

function flattenGeoJson(
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
