import type { GeoPath, GeoProjection } from 'd3-geo'
import type {
  Feature,
  FeatureCollection,
} from 'geojson'
import type { Topology } from 'topojson-specification'
import {
  geoEqualEarth,
  geoPath,
} from 'd3-geo'
import { feature } from 'topojson-client'
import { isNumber } from './utils'
import type { MapFeature } from './feature'

type MapData = FeatureCollection | Topology
type DataTransformer = (features: MapFeature[]) => MapFeature[]

export interface ProjectionConfig {
  center?: [number, number]
  rotate?: [number, number, number]
  scale?: number
}

export interface MapConfig {
  width: number
  height: number
  projection?: () => GeoProjection
  projectionConfig?: ProjectionConfig
  data: MapData
  dataTransformer?: DataTransformer
}

export interface MapContext {
  width: number
  height: number
  projection?: GeoProjection
  features: MapFeature[]
  path: GeoPath
  renderPath: (feature: Feature) => ReturnType<GeoPath>
}

export function makeProjection({
  width,
  height,
  config,
  projection,
  geoJson,
}: {
  width: number
  height: number
  config?: ProjectionConfig
  projection?: () => GeoProjection
  geoJson?: FeatureCollection
}): GeoProjection {
  const mapProjection = (projection ?? geoEqualEarth)()

  if (config?.center) {
    const [cx, cy] = config.center
    if (isNumber(cx) && isNumber(cy)) {
      mapProjection.center([cx, cy])
    }
  }
  if (config?.rotate) {
    const [rx, ry, rz] = config.rotate
    if (isNumber(rx) && isNumber(ry)) {
      mapProjection.rotate([rx, ry, isNumber(rz) ? rz : 0])
    }
  }
  if (config && isNumber(config.scale)) {
    mapProjection.scale(config.scale)
  }

  if (geoJson) {
    mapProjection.fitSize([width, height], geoJson)
  } else {
    mapProjection.translate([width / 2, height / 2])
  }

  return mapProjection
}

export function makeFeatures(
  geoData: MapData,
  dataTransformer?: DataTransformer,
): [ features: MapFeature[], geoJson: FeatureCollection ] {
  let geoJson: FeatureCollection
  if (isTopology(geoData)) {
    const objectKey = Object.keys(geoData.objects)[0]
    const topoObject = geoData.objects[objectKey]
    geoJson = feature(geoData, topoObject) as FeatureCollection
  } else {
    geoJson = geoData
  }

  const features = dataTransformer ? dataTransformer(geoJson.features) : geoJson.features
  return [ features, geoJson ]
}

export const makePathFn = (mapProjection: GeoProjection): GeoPath => geoPath().projection(mapProjection)

export function makeMapContext({
  width,
  height,
  data,
  dataTransformer,
  projection: providedProjection,
  projectionConfig,
}: MapConfig): MapContext {
  const [features, geoJson] = makeFeatures(data, dataTransformer)
  const projection = makeProjection({
    width,
    height,
    projection: providedProjection,
    config: projectionConfig,
    geoJson,
  })

  const pathFn = makePathFn(projection);

  return {
    width,
    height,
    projection,
    features,
    path: pathFn,
    renderPath: (feature: Feature) => pathFn(feature),
  }
}

export function isTopology(data: MapData): data is Topology {
  return (data as Topology)?.type === 'Topology'
}
