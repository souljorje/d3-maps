import type { MapData } from '@d3-maps/core'

import {
  MapBase,
  MapFeatures,
  MapLine,
  MapMarker,
} from '@d3-maps/react'
import { curveBasis } from 'd3-shape'
import {
  useEffect,
  useState,
} from 'react'
import { withBase } from 'vitepress'

const cities = [
  { name: 'San Francisco', coordinates: [-122.4194, 37.7749] },
  { name: 'New York', coordinates: [-73.935242, 40.73061] },
  { name: 'London', coordinates: [-0.1276, 51.5072] },
  { name: 'Tbilisi', coordinates: [44.793, 41.7151] },
  { name: 'Dubai ', coordinates: [55.2708, 25.2048] },
  { name: 'Tokyo', coordinates: [139.6503, 35.6762] },
]

const directFlights = [
  [cities[0], cities[1]],
  [cities[1], cities[2]],
  [cities[2], cities[3]],
  [cities[5], cities[0]],
]

const transitFlight = [
  cities[3].coordinates,
  cities[4].coordinates,
  cities[5].coordinates,
]

const returnFlight = [
  cities[5].coordinates,
  cities[0].coordinates,
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
        <MapBase data={mapData}>
          <MapFeatures />

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

          {/* Path per each connection */}
          {
            directFlights.map(([flightFrom, flightTo]) => (
              <MapLine
                key={`${flightFrom.name}-${flightTo.name}`}
                coordinates={[flightFrom.coordinates, flightTo.coordinates]}
                strokeWidth={1.5}
                markerEnd="url(#connections-arrow)"
              />
            ))
          }

          {/* Single path for all connections */}
          <MapLine
            coordinates={transitFlight}
            strokeWidth={1.5}
            strokeDasharray="4 4"
            markerEnd="url(#connections-arrow)"
          />

          {/* Custom curved path for manual display control,
          instead of native render */}
          <MapLine
            coordinates={returnFlight}
            custom
            curve={curveBasis}
            curveOffset={[0.2, 0.9]}
            strokeWidth={1.5}
            strokeDasharray="2 2"
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
                fill="var(--vp-c-brand-3)"
              />
            </marker>
          </defs>
        </MapBase>
      )
    : null
}
