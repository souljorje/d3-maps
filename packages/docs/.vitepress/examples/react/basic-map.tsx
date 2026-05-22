import type { MapDataSource } from '@d3-maps/react'

import {
  MapBase,
  MapFeatures,
  MapMesh,
} from '@d3-maps/react'
import { useEffect, useState } from 'react'

export default function BasicExample(): JSX.Element | null {
  const [mapData, setMapData] = useState<MapDataSource>()

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
          <MapFeatures data={mapData} />
          <MapMesh data={mapData} />
        </MapBase>
      )
    : null
}
