import {
  MapBase,
  MapFeatures,
  MapMesh,
} from '@d3-maps/react'
import { use } from 'react'

const mapDataPromise = import('@d3-maps/atlas/world/countries/countries-110m').then((m) => m.default)

export default function BasicExample(): JSX.Element {
  const mapData = use(mapDataPromise)

  return (
    <MapBase>
      <MapFeatures data={mapData} />
      <MapMesh data={mapData} />
    </MapBase>
  )
}
