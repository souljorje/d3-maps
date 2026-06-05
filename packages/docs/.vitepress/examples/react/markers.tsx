import type { MapData } from '@d3-maps/react'

import {
  MapBase,
  MapFeatures,
  MapGraticule,
  MapMarker,
  MapMesh,
  MapSphere,
} from '@d3-maps/react'
import { useEffect, useState } from 'react'

interface City {
  city: string
  lon: number
  lat: number
}

const cities: City[] = [
  { city: 'Minsk', lon: 27.34, lat: 53.54 },
  { city: 'Dili', lon: 125.36, lat: -8.35 },
  { city: 'Dushanbe', lon: 68.48, lat: 38.35 },
  { city: 'Njamena', lon: 12.1348, lat: 15.0557 },
  { city: 'Malabo', lon: 8.47, lat: 3.45 },
  { city: 'Tokyo', lon: 139.45, lat: 35.41 },
  { city: 'Georgetown', lon: -58.1, lat: 6.48 },
]

export default function MarkersExample(): JSX.Element | null {
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
          <MapSphere
            fill="var(--vp-c-bg-alt)"
            stroke="var(--vp-c-border)"
          >
            <MapGraticule />
            <MapFeatures data={mapData} />
            <MapMesh data={mapData} />
            {
              cities.map((item) => (
                <MapMarker
                  key={item.city}
                  coordinates={[item.lon, item.lat]}
                >
                  <text
                    fontSize="14"
                    y={-6}
                    textAnchor="middle"
                  >
                    {item.city}
                  </text>
                  <circle
                    r={3}
                  />
                </MapMarker>
              ))
            }
          </MapSphere>
        </MapBase>
      )
    : null
}
