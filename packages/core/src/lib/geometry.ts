import type {
  Geometry,
  GeometryCollection,
} from 'geojson'

import type { MapObjectProps } from './mapObject'

export type MapGeometryData = Geometry
export type MapGeometryCollectionData = GeometryCollection<MapGeometryData>

export interface MapGeometriesProps<TStyle = unknown> extends MapObjectProps<TStyle> {}
