import type { ZoomEvent } from '@d3-maps/react'

import {
  getInverseZoomScale,
  MapBase,
  MapFeatures,
  MapMarker,
  MapMesh,
  MapZoom,
} from '@d3-maps/react'
import { extent } from 'd3-array'
import { geoAlbersUsa } from 'd3-geo'
import { scaleLinear } from 'd3-scale'
import { use, useMemo, useState } from 'react'
import { withBase } from 'vitepress'

interface City {
  city: string
  latitude: number
  longitude: number
  population: number
}

export default function BubbleMapExample(): JSX.Element {
  const mapData = use(fetch(withBase('/example-data/states-10m.json')).then((r) => r.json()))
  const cities: City[] = use(fetch(withBase('/example-data/us-cities.json')).then((r) => r.json()))
  const [markerScale, setMarkerScale] = useState(1)

  const minAndMaxValues = useMemo(() => {
    return extent(cities, (item) => Number(item.population))
  }, [cities])

  const bubbleScale = useMemo(() => {
    const safeDomain: [number, number] = [
      minAndMaxValues[0] ?? 0,
      minAndMaxValues[1] ?? 1,
    ]

    return scaleLinear()
      .domain(safeDomain)
      .range([3, 35])
  }, [
    minAndMaxValues[0],
    minAndMaxValues[1],
  ])

  function updateMarkerScale(event: ZoomEvent): void {
    setMarkerScale(getInverseZoomScale(event))
  }

  return (
    <MapBase
      data={mapData}
      projection={geoAlbersUsa}
    >
      <MapZoom
        maxZoom={100}
        onZoom={updateMarkerScale}
      >
        <MapFeatures />
        <g>
          {
            cities.map((item) => (
              <MapMarker
                key={item.city}
                coordinates={[item.longitude, item.latitude]}
              >
                <circle
                  fill="var(--vp-c-brand)"
                  style={{ opacity: 0.85 }}
                  r={bubbleScale(item.population)}
                  transform={`scale(${markerScale})`}
                />
              </MapMarker>
            ))
          }
        </g>
        <MapMesh />
      </MapZoom>
    </MapBase>
  )
}
