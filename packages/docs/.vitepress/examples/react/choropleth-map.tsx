import type { MapFeatureData } from '@d3-maps/react'

import {
  MapBase,
  MapFeature,
  MapFeatures,
} from '@d3-maps/react'
import { extent } from 'd3-array'
import { scaleLinear } from 'd3-scale'
import { use, useCallback, useMemo } from 'react'
import { withBase } from 'vitepress'

interface CountryStat {
  id: string
  value: number
}

export default function ChoroplethMapExample(): JSX.Element {
  const mapData = use(import('world-atlas/countries-110m.json').then((m) => m.default))
  const rawData = use(fetch(withBase('/example-data/choropleth-data.json')).then((r) => r.json()))

  const data: CountryStat[] = useMemo(() => {
    return (rawData as Record<string, unknown>[]).map((item: Record<string, unknown>) => {
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
  }, [rawData])

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

  const dataTransformer = useCallback((features: MapFeatureData[]): MapFeatureData[] => {
    return features.map((feature) => {
      const country = data.find((item) => item.id === String(feature.id))
      const colorValue = country ? colorScale(country.value) : ''

      return { ...feature, color: colorValue }
    })
  }, [
    data,
    colorScale,
  ])

  return (
    <MapBase
      data={mapData}
      dataTransformer={dataTransformer}
    >
      <MapFeatures>
        {({ features }) => (
          <>
            {
              features.map((feature) => (
                <MapFeature
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
    </MapBase>
  )
}
