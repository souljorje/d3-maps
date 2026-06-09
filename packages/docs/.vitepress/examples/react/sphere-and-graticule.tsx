import {
  MapBase,
  MapFeatures,
  MapGraticule,
  MapMesh,
  MapSphere,
} from '@d3-maps/react'
import { use } from 'react'

const mapDataPromise = import('@d3-maps/atlas/world/countries/countries-110m').then((m) => m.default)

export default function SphereAndGraticuleExample(): JSX.Element {
  const mapData = use(mapDataPromise)

  return (
    <MapBase>
      <MapSphere
        fill="var(--vp-c-bg-alt)"
        stroke="var(--vp-c-border)"
      >
        <MapGraticule />
        <MapFeatures data={mapData} />
        <MapMesh data={mapData} />
      </MapSphere>
    </MapBase>
  )
}
