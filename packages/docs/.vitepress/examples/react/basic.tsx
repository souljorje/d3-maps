import type { MapData } from '@d3-maps/react'

import {
  MapBase,
  MapFeatures,
  MapMesh,
} from '@d3-maps/react'
import { useEffect, useState } from 'react'

export default function BasicExample(): JSX.Element | null {
  const [mapData, setMapData] = useState<MapData>()

  useEffect(() => {
    let isCancelled = false

    async function loadMap(): Promise<void> {
      const { default: payload } = await import('world-atlas/countries-110m.json')

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
        <MapBase data={mapData}>
          <MapFeatures />
          <MapMesh />
        </MapBase>
      )
    : null
}
