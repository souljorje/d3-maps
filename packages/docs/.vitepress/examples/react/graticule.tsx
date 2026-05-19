import type { MapData } from '@d3-maps/react'

import {
  MapBase,
  MapGraticule,
  MapMesh,
  MapObjects,
} from '@d3-maps/react'
import {
  useEffect,
  useState,
} from 'react'

export default function GraticuleExample(): JSX.Element | null {
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
        <MapBase data={mapData}>
          <MapGraticule
            background
            border
          />
          <MapObjects />
          <MapMesh />
        </MapBase>
      )
    : null
}
