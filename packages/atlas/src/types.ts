import type {
  GeometryObject,
  Topology,
} from 'topojson-specification'
// #region types
// #region props
export type AtlasFeatureProperties = {
  id: string
  name: string
  name_long?: string
}
// #endregion props

export type AtlasNamedTopology = Topology<
  Record<string, GeometryObject<AtlasFeatureProperties>>
>

export type AtlasCountryTopology = AtlasNamedTopology

export type AtlasContinentTopology = AtlasNamedTopology

export type AtlasWorldCountriesTopology = AtlasNamedTopology

// #region metadata

export type AtlasScale = '110m' | '50m' | '10m'

export type CountryMetadata = {
  slug: string
  exportName: string
  name: string
  adm0A3: string
  isoA2?: string
  isoA3?: string
  continent?: string
  region?: string
  subregion?: string
  popEst?: number
  gdpMd?: number
  scales: AtlasScale[]
  defaultScale: AtlasScale
}

export type ContinentMetadata = {
  name: string
  slug: string
  exportName: string
  defaultScale: AtlasScale
  scales: AtlasScale[]
}
// #endregion metadata
// #endregion types
export type {
  GeometryObject,
  Topology,
} from 'topojson-specification'
