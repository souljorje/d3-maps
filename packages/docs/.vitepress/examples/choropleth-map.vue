<template>
  <MapBase>
    <MapFeatures
      :data="mapData"
      :transformer="transformer"
    >
      <template #default="{ features }">
        <MapFeature
          v-for="feature in features"
          :key="feature.key"
          :d="feature.d"
          :fill="feature.color"
          stroke="#777"
          :styles="{
            hover: {
              opacity: 0.8,
            },
          }"
        />
      </template>
    </MapFeatures>
  </MapBase>
</template>

<script setup lang="ts">
import type {
  MapData,
  MapFeatureTransformer,
} from '@d3-maps/vue'

import { extent } from 'd3-array'
import { scaleSqrt } from 'd3-scale'
import { computed, onMounted, ref } from 'vue'

interface CountryPopulation {
  id: string
  population: number
}

interface ChoroplethFeatureExtra {
  color: string
}

const mapData = ref<MapData>()
const populations = ref<CountryPopulation[]>([])

const colorScale = computed(() => {
  const [min = 0, max = 1] = extent(populations.value, (country) => country.population)

  return scaleSqrt<string>()
    .domain([min, max])
    .range(['#ffefee', '#e04600'])
})

const populationByCode = computed(() => {
  return new Map(populations.value.map((country) => [country.id, country.population]))
})

onMounted(async () => {
  const [loadedData, loadedMap] = await Promise.all([
    fetchData(),
    fetchMap(),
  ])

  populations.value = loadedData
  mapData.value = loadedMap
})

async function fetchMap(): Promise<MapData> {
  const { default: data } = await import('@d3-maps/atlas/world/countries/countries-110m')
  return data
}

async function fetchData(): Promise<CountryPopulation[]> {
  const response = await fetch('/api/countries')
  const data = await response.json()
  return data.map(
    ({ alpha3Code, population }: { alpha3Code: string, population: number }) => ({ id: alpha3Code, population }),
  )
}

const transformer: MapFeatureTransformer<ChoroplethFeatureExtra> = (features) => {
  return features.map((feature) => {
    const code = String(feature.properties.id)
    const population = populationByCode.value.get(code)

    return {
      ...feature,
      color: population == null || code === 'ATA'
        ? '#eee'
        : colorScale.value(population),
    }
  })
}
</script>
