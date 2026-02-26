import type {
  MapData,
  MapFeature,
} from '@d3-maps/core'

import {
  MapFeature as D3MapFeature,
  Map,
  MapFeatures,
} from '@d3-maps/react'
import { extent } from 'd3-array'
import { scaleLinear } from 'd3-scale'
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { withBase } from 'vitepress'

interface CountryStat {
  id: string
  value: number
}

export default function ChoroplethExample(): JSX.Element {
  const [mapData, setMapData] = useState<MapData>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [data, setData] = useState<CountryStat[]>([])

  useEffect(() => {
    let isCancelled = false

    async function fetchMap(): Promise<MapData> {
      const response = await fetch(withBase('/example-data/countries-110m.json'))
      return response.json()
    }

    async function fetchData(): Promise<CountryStat[]> {
      const response = await fetch(withBase('/example-data/choropleth-data.json'))
      const rawData = await response.json()

      return rawData.map((item: Record<string, unknown>) => {
        const id = item['country-code']
        if (typeof id !== 'string') {
          return { id: '', value: 0 }
        }

        return {
          ...item,
          id,
          value: Number(id),
        }
      })
    }

    Promise.all([fetchMap(), fetchData()])
      .then(([loadedMap, loadedData]) => {
        if (isCancelled) {
          return
        }

        setMapData(loadedMap)
        setData(loadedData)
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
    return extent(data, (item) => item.value)
  }, [data])

  const colorScale = useMemo(() => {
    const safeDomain: [number, number] = [
      minAndMaxValues[0] ?? 0,
      minAndMaxValues[1] ?? 1,
    ]

    return scaleLinear<string>()
      .domain(safeDomain)
      .range(['#e0460030', '#e04600'])
  }, [
    minAndMaxValues[0],
    minAndMaxValues[1],
  ])

  const dataTransformer = useCallback((features: MapFeature[]): MapFeature[] => {
    return features.map((feature) => {
      const country = data.find((item) => item.id === String(feature.id))
      const colorValue = country ? colorScale(country.value) : ''

      return { ...feature, color: colorValue }
    })
  }, [
    data,
    colorScale,
  ])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error || !mapData) {
    return <div>An error occurred</div>
  }

  return (
    <Map
      data={mapData}
      dataTransformer={dataTransformer}
    >
      <MapFeatures>
        {({ features }) => (
          <>
            {
              features.map((feature) => (
                <D3MapFeature
                  key={String(feature.id)}
                  data={feature}
                  styles={{
                    default: {
                      fill: String(feature.color),
                      stroke: '#777',
                    },
                    hover: {
                      fill: String(feature.color),
                      stroke: '#777',
                      opacity: 0.8,
                    },
                  }}
                />
              ))
            }
          </>
        )}
      </MapFeatures>
    </Map>
  )
}
