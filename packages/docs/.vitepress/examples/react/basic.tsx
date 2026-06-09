import {
  MapBase,
  MapFeatures,
  MapMesh,
} from '@d3-maps/react'
import { use } from 'react'

const mapDataPromise = import('world-atlas/countries-110m.json').then((m) => m.default)

export default function BasicExample(): JSX.Element {
  const mapData = use(mapDataPromise)

  return (
    <MapBase data={mapData}>
      <MapFeatures />
      <MapMesh />
    </MapBase>
  )
}
