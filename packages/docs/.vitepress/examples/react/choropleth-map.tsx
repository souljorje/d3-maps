import type {
  MapData,
  MapFeatureTransformer,
} from '@d3-maps/react'

import {
  MapBase,
  MapFeature,
  MapFeatures,
} from '@d3-maps/react'
import { extent } from 'd3-array'
import { scaleSqrt } from 'd3-scale'
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

interface CountryPopulation {
  cca3: string
  population: number
}

interface ChoroplethFeatureExtra {
  color: string
}

export default function ChoroplethMapExample(): JSX.Element {
  const [mapData, setMapData] = useState<MapData>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [populations, setPopulations] = useState<CountryPopulation[]>([])

  useEffect(() => {
    let isCancelled = false

    async function fetchMap(): Promise<MapData> {
      const { default: payload } = await import('@d3-maps/atlas/world/countries/countries-110m')
      return payload
    }

    async function fetchData(): Promise<CountryPopulation[]> {
      const response = await fetch('https://restcountries.com/v3.1/all?fields=cca3,population')
      return response.json()
    }

    Promise.all([fetchMap(), fetchData()])
      .then(([loadedMap, loadedData]) => {
        if (isCancelled) return

        setMapData(loadedMap)
        setPopulations(loadedData)
      })
      .catch(() => {
        if (!isCancelled) setError(true)
      })
      .finally(() => {
        if (!isCancelled) setLoading(false)
      })

    return () => {
      isCancelled = true
    }
  }, [])

  const minAndMaxValues = useMemo(() => {
    return extent(populations, (country) => country.population)
  }, [populations])

  const colorScale = useMemo(() => {
    const safeDomain: [number, number] = [
      minAndMaxValues[0] ?? 0,
      minAndMaxValues[1] ?? 1,
    ]

    return scaleSqrt<string>()
      .domain(safeDomain)
      .range(['#ffefee', '#e04600'])
  }, [
    minAndMaxValues[0],
    minAndMaxValues[1],
  ])

  const populationByCode = useMemo(() => {
    return new Map(populations.map((country) => [country.cca3, country.population]))
  }, [populations])

  const transformer = useCallback<MapFeatureTransformer<ChoroplethFeatureExtra>>((features) => {
    return features.map((feature) => {
      const code = String(feature.properties.id)
      const population = populationByCode.get(code)

      return {
        ...feature,
        color: population == null || code === 'ATA'
          ? '#eee'
          : colorScale(population),
      }
    })
  }, [
    colorScale,
    populationByCode,
  ])

  if (loading) return <></>
  if (error || !mapData) return <></>

  return (
    <MapBase>
      <MapFeatures
        data={mapData}
        transformer={transformer}
      >
        {({ features }) => (
          features.map((feature) => (
            <MapFeature
              key={feature.key}
              d={feature.d}
              fill={feature.color}
              stroke="#777"
              styles={{
                hover: {
                  opacity: 0.8,
                },
              }}
            />
          ))
        )}
      </MapFeatures>
    </MapBase>
  )
}
