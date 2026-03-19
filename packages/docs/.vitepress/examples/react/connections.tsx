import type { MapData } from '@d3-maps/core'

import {
  Map,
  MapFeatures,
  MapLine,
  MapMarker,
  MapMesh,
} from '@d3-maps/react'
import {
  useEffect,
  useState,
} from 'react'
import { withBase } from 'vitepress'

const cities = [
  { name: 'San Francisco', coordinates: [-122.4194, 37.7749] },
  { name: 'New York', coordinates: [-73.935242, 40.73061] },
  { name: 'London', coordinates: [-0.1276, 51.5072] },
  { name: 'Tokyo', coordinates: [139.6503, 35.6762] },
  { name: 'Dubai ', coordinates: [55.2708, 25.2048] },
  { name: 'Tbilisi', coordinates: [44.793, 41.7151] },
]

const visitFlights = [
  [cities[0], cities[1]],
  [cities[1], cities[2]],
  [cities[2], cities[3]],
]

const returnRouteCoordinates = [
  cities[3].coordinates,
  cities[4].coordinates,
  cities[5].coordinates,
]

export default function ConnectionsExample(): JSX.Element | null {
  const [mapData, setMapData] = useState<MapData>()

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

  return mapData
    ? (
        <Map data={mapData}>
          <MapFeatures />
          <MapMesh />

          {
            cities.map((city) => (
              <MapMarker
                key={city.name}
                coordinates={city.coordinates}
              >
                <circle r={3} />
                <text
                  y={city.name === 'Tbilisi' ? -8 : 14}
                  fontSize={12}
                  textAnchor="middle"
                >
                  {city.name}
                </text>
              </MapMarker>
            ))
          }

          {
            visitFlights.map((flight) => (
              <MapLine
                key={`${flight[0].name}-${flight[1].name}`}
                coordinates={[flight[0].coordinates, flight[1].coordinates]}
                strokeWidth={1.5}
                markerEnd="url(#connections-arrow)"
              />
            ))
          }

          <MapLine
            coordinates={returnRouteCoordinates}
            strokeWidth={1.5}
            strokeDasharray="4 4"
            markerEnd="url(#connections-arrow)"
          />

          {/* Custom line end */}
          <defs>
            <marker
              id="connections-arrow"
              viewBox="0 0 10 10"
              refX={14}
              refY={5}
              markerWidth={5}
              markerHeight={5}
              orient="auto-start-reverse"
            >
              <path
                d="M 0 0 L 10 5 L 0 10 z"
              />
            </marker>
          </defs>
        </Map>
      )
    : null
}
