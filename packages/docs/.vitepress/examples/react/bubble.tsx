import type {
  MapData,
  ZoomEvent,
} from '@d3-maps/core'

import {
  getInverseZoomScale,
} from '@d3-maps/core'
import {
  Map,
  MapFeatures,
  MapMarker,
  MapMesh,
  MapZoom,
} from '@d3-maps/react'
import { extent } from 'd3-array'
import { geoAlbersUsa } from 'd3-geo'
import { scaleLinear } from 'd3-scale'
import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import { withBase } from 'vitepress'

interface City {
  city: string
  latitude: number
  longitude: number
  population: number
}

export default function BubbleExample(): JSX.Element {
  const [mapData, setMapData] = useState<MapData>()
  const [cities, setCities] = useState<City[]>([])
  const [markerScale, setMarkerScale] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let isCancelled = false

    async function fetchMap(): Promise<MapData> {
      const response = await fetch(withBase('/example-data/states-10m.json'))
      return response.json()
    }

    async function fetchData(): Promise<City[]> {
      const response = await fetch(withBase('/example-data/us-cities.json'))
      return response.json()
    }

    Promise.all([fetchMap(), fetchData()])
      .then(([loadedMap, loadedCities]) => {
        if (isCancelled) {
          return
        }

        setMapData(loadedMap)
        setCities(loadedCities)
      })
      .catch(() => {
        if (!isCancelled) {
          setError(true)
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setLoading(false)
        }
      })

    return () => {
      isCancelled = true
    }
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

  if (loading) {
    return <div>Loading...</div>
  }

  if (error || !mapData) {
    return <div>An error occurred</div>
  }

  return (
    <Map
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
    </Map>
  )
}
