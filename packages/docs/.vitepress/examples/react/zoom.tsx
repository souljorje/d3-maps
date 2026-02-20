import type {
  MapData,
  ZoomEvent,
} from '@d3-maps/core'

import {
  Map,
  MapFeatures,
  MapMarker,
  MapZoom,
} from '@d3-maps/react'
import { geoEqualEarth } from 'd3-geo'
import {
  useEffect,
  useState,
} from 'react'
import { withBase } from 'vitepress'

interface City {
  city: string
  lon: number
  lat: number
}

const initialCities: City[] = [
  { city: 'Minsk', lon: 27.34, lat: 53.54 },
  { city: 'Dili', lon: 125.36, lat: -8.35 },
  { city: 'Dushanbe', lon: 68.48, lat: 38.35 },
  { city: 'Guatemala City', lon: -90.31, lat: 14.37 },
  { city: 'Njamena', lon: 12.1348, lat: 15.0557 },
  { city: 'Tokyo', lon: 139.45, lat: 35.41 },
  { city: 'Georgetown', lon: -58.1, lat: 6.48 },
]

export default function ZoomExample(): JSX.Element | null {
  const [mapData, setMapData] = useState<MapData>()
  const [markerScale, setMarkerScale] = useState(1)

  useEffect(() => {
    let isCancelled = false

    async function loadMap(): Promise<void> {
      const response = await fetch(withBase('/example-data/countries-110m.json'))
      const payload = await response.json()

      if (!isCancelled) {
        setMapData(payload)
      }
    }

    loadMap()

    return () => {
      isCancelled = true
    }
  }, [])

  function updateMarkerScale(event: ZoomEvent): void {
    setMarkerScale(1 / event.transform.k)
  }

  return mapData
    ? (
        <Map
          data={mapData}
          projection={geoEqualEarth}
        >
          <MapZoom onZoomEnd={updateMarkerScale}>
            <MapFeatures />
            {
              initialCities.map((item) => (
                <MapMarker
                  key={item.city}
                  coordinates={[item.lon, item.lat]}
                >
                  <g transform={`scale(${markerScale})`}>
                    <text
                      fontSize="16"
                      y={-6}
                      textAnchor="middle"
                    >
                      {item.city}
                    </text>
                    <circle
                      fill="#ff6f26"
                      r={3}
                    />
                  </g>
                </MapMarker>
              ))
            }
          </MapZoom>
        </Map>
      )
    : null
}
