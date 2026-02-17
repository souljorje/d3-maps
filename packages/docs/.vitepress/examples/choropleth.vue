<template>
  <div v-if="loading">
    Loading...
  </div>
  <div v-else-if="error">
    An error occurred
  </div>
  <Map
    v-else
    :data-transformer="dataTransformer"
    :data="mapData"
  >
    <MapFeatures v-slot="{ features }">
      <MapFeature
        v-for="feature in features"
        :key="String(feature.id)"
        :data="feature"
        :styles="{
          default: {
            fill: feature.color,
            stroke: 'darkslategray',
          },
          hover: {
            fill: feature.color,
            stroke: 'darkslategray',
            opacity: 0.8,
          },
        }"
      />
    </MapFeatures>
  </Map>
</template>

<script setup lang="ts">
import { extent } from 'd3-array'
import { scaleLinear } from 'd3-scale'
import { computed, onMounted, ref } from 'vue'

interface CountryStat {
  id: string
  value: number
}

const mapData = ref<unknown>()
const loading = ref(true)
const error = ref(false)
const data = ref<CountryStat[]>([])

const minAndMaxValues = computed(() => extent(data.value, (item) => item.value))
const colorScale = computed(() => {
  const domain = minAndMaxValues.value
  const safeDomain: [number, number] = [
    domain?.[0] ?? 0,
    domain?.[1] ?? 1,
  ]
  return scaleLinear<string>()
    .domain(safeDomain)
    .range(['beige', 'darkorange'])
})

onMounted(async () => {
  try {
    await Promise.all([fetchData(), fetchMap()])
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
})

async function fetchMap() {
  const response = await fetch('/example-data/countries-110m.json')
  mapData.value = await response.json()
}

async function fetchData() {
  const response = await fetch('/choropleth-data.json')
  const rawData = await response.json()
  data.value = rawData.map((item) => {
    const id = item['country-code']
    return {
      ...item,
      id,
      value: Number(id) * Math.random(),
    }
  })
}

function dataTransformer(features: any[]) {
  return features.map((feature) => {
    const country = data.value.find((item) => item.id === feature.id)
    const colorValue = country ? colorScale.value(country.value) : '#eee'

    return { ...feature, color: colorValue }
  })
}
</script>
