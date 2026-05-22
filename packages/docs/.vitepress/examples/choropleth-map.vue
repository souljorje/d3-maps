<template>
  <MapBase
    v-if="mapData && populations.length"
  >
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
  MapFeatureExtension,
  MapFeatureTransformer,
} from '@d3-maps/vue'

import { isFeature } from '@d3-maps/vue'
import { extent } from 'd3-array'
import { scaleSqrt } from 'd3-scale'
import { computed, onMounted, ref } from 'vue'

interface CountryPopulation {
  cca3: string
  population: number
}

type ChoroplethFeature = MapFeatureExtension<{
  color: string
}>

const mapData = ref<MapData>()
const populations = ref<CountryPopulation[]>([])

const colorScale = computed(() => {
  const [min = 0, max = 1] = extent(populations.value, (country) => country.population)

  return scaleSqrt<string>()
    .domain([min, max])
    .range(['#ffefee', '#e04600'])
})

const populationByCode = computed(() => {
  return new Map(populations.value.map((country) => [country.cca3, country.population]))
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
  const { default: data } = await import('@d3-maps/atlas/world/countries')
  return data
}

async function fetchData(): Promise<CountryPopulation[]> {
  const response = await fetch('https://restcountries.com/v3.1/all?fields=cca3,population')
  return response.json()
}

const transformer: MapFeatureTransformer<ChoroplethFeature> = (features) => {
  return features.map((feature) => {
    const population = isFeature(feature)
      ? populationByCode.value.get(String(feature.properties?.id))
      : undefined

    return {
      ...feature,
      color: population == null || (isFeature(feature) && feature.properties?.id === 'ATA')
        ? '#eee'
        : colorScale.value(population),
    }
  })
}
</script>
