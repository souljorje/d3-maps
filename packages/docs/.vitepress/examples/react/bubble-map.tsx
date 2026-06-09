import type { MapData, ZoomEvent } from '@d3-maps/react'

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
import { useEffect, useMemo, useState } from 'react'
import { withBase } from 'vitepress'

interface City {
  city: string
  latitude: number
  longitude: number
  population: number
}

export default function BubbleMapExample(): JSX.Element {
  const [mapData, setMapData] = useState<MapData | null>(null)
  const [cities, setCities] = useState<City[]>([])
  const [markerScale, setMarkerScale] = useState(1)

  useEffect(() => {
    void Promise.all([
      fetch(withBase('/example-data/states-10m.json')).then((r) => r.json()),
      fetch(withBase('/example-data/us-cities.json')).then((r) => r.json()),
    ]).then(([mapJson, citiesJson]: [MapData, City[]]) => {
      setMapData(mapJson)
      setCities(citiesJson)
    })
  }, [])

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

  if (!mapData) {
    return <></>
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
