import type { ZoomEvent } from '@d3-maps/react'

import {
  MapBase,
  MapFeatures,
  MapGraticule,
  MapMarker,
  MapMesh,
  MapSphere,
  MapZoom,
} from '@d3-maps/react'
import { geoNaturalEarth1 } from 'd3-geo'
import {
  use,
  useRef,
  useState,
} from 'react'

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

const mapDataPromise = import('@d3-maps/atlas/world/countries/countries-110m').then((m) => m.default)

export default function ZoomExample(): JSX.Element {
  const mapData = use(mapDataPromise)
  const [markerScale, setMarkerScale] = useState(1)
  const currentZoomRef = useRef(1)

  function updateMarkerScale(event: ZoomEvent): void {
    if (currentZoomRef.current === event.transform.k) {
      return
    }

    currentZoomRef.current = event.transform.k
    setMarkerScale(1 / event.transform.k)
  }

  return (
    <MapBase
      projection={geoNaturalEarth1}
    >
      <MapZoom onZoom={updateMarkerScale}>
        <MapSphere
          fill="var(--vp-c-bg-alt)"
          stroke="var(--vp-c-border)"
        >
          <MapGraticule />
          <MapFeatures data={mapData} />
          <MapMesh data={mapData} />
          {
            initialCities.map((item) => (
              <MapMarker
                key={item.city}
                coordinates={[item.lon, item.lat]}
              >
                <g transform={`scale(${markerScale})`}>
                  <text
                    fontSize="14"
                    y={-8}
                    textAnchor="middle"
                  >
                    {item.city}
                  </text>
                  <circle r={3} />
                </g>
              </MapMarker>
            ))
          }
        </MapSphere>
      </MapZoom>
    </MapBase>
  )
}
