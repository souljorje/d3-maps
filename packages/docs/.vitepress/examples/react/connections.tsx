import type { MapData } from '@d3-maps/core'

import {
  Map,
  MapFeatures,
  MapLine,
  MapMarker,
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
]

const connections = [
  { id: 'sf-nyc', coordinates: [cities[0].coordinates, cities[1].coordinates], stroke: '#ff6f26' },
  { id: 'nyc-london', coordinates: [cities[1].coordinates, cities[2].coordinates], stroke: '#fb923c' },
  { id: 'london-tokyo', coordinates: [cities[2].coordinates, cities[3].coordinates], stroke: '#f97316' },
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

          <MapFeatures />
          <MapMesh />

          {
            connections.map((connection) => (
              <MapLine
                key={connection.id}
                coordinates={connection.coordinates}
                curve
                stroke={connection.stroke}
                strokeWidth={1.8}
                fill="none"
                strokeLinecap="round"
                markerEnd="url(#connections-arrow)"
                style={{ opacity: 0.85 }}
              />
            ))
          }

          {
            cities.map((city) => (
              <MapMarker
                key={city.name}
                coordinates={city.coordinates}
              >
                <circle
                  r={2.5}
                  fill="#111827"
                />
                <text
                  y={-8}
                  fontSize={11}
                  textAnchor="middle"
                  fill="#111827"
                >
                  {city.name}
                </text>
              </MapMarker>
            ))
          }
        </Map>
      )
    : null
}
