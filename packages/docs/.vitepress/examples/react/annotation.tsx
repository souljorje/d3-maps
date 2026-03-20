import type { MapData } from '@d3-maps/core'

import {
  MapAnnotation,
  MapBase,
  MapFeatures,
} from '@d3-maps/react'
import {
  useEffect,
  useState,
} from 'react'
import { withBase } from 'vitepress'

interface Sity {
  name: string
  coordinates: [number, number]
  color: string
}

const sities: Sity[] = [
  {
    name: 'Paris',
    coordinates: [2.3522, 48.8566],
    color: '#ff6f26',
  },
  {
    name: 'New York',
    coordinates: [-73.935242, 40.73061],
    color: '#2563eb',
  },
]

export default function AnnotationExample(): JSX.Element | null {
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
          {sities.map((sity) => (
            <MapAnnotation
              key={sity.name}
              coordinates={sity.coordinates}
              stroke={sity.color}
              length={40}
              angle={-90}
              margin={2}
              strokeWidth={2}
            >
              <text
                y={-6}
                textAnchor="middle"
                fontSize={12}
              >
                {sity.name}
              </text>
            </MapAnnotation>
          ))}
        </MapBase>
      )
    : null
}
