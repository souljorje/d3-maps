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
          <MapAnnotation
            coordinates={[2.3522, 48.8566]}
            length={36}
            angle={-35}
            margin={10}
            stroke="#ff6f26"
            strokeWidth={2}
          >
            <text
              y={-6}
              textAnchor="middle"
              fontSize={12}
            >
              Paris
            </text>
          </MapAnnotation>
          <MapAnnotation
            coordinates={[-73.935242, 40.73061]}
            length={52}
            angle={-20}
            margin={4}
            stroke="#2563eb"
            strokeWidth={2}
          >
            <text
              y={-6}
              textAnchor="middle"
              fontSize={12}
            >
              New York
            </text>
          </MapAnnotation>
        </MapBase>
      )
    : null
}
