import type { MapData } from '@d3-maps/react'

import {
  MapBase,
  MapFeatures,
  MapGraticule,
  MapMesh,
  MapSphere,
} from '@d3-maps/react'
import {
  useEffect,
  useState,
} from 'react'

export default function SphereAndGraticuleExample(): JSX.Element | null {
  const [mapData, setMapData] = useState<MapData>()

  useEffect(() => {
    let isCancelled = false

    async function loadMap(): Promise<void> {
      const { default: payload } = await import('@d3-maps/atlas/world/countries')

      if (!isCancelled) {
        setMapData(payload)
      }
    }

    loadMap()

    return () => {
      isCancelled = true
    }
  }, [])

  return mapData
    ? (
        <MapBase>
          <MapSphere fill="var(--vp-c-bg-alt)" />
          <MapGraticule />
          <MapFeatures data={mapData} />
          <MapMesh data={mapData} />
          <MapSphere stroke="var(--vp-c-border)" />
        </MapBase>
      )
    : null
}
