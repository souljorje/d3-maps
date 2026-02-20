<template>
  <Map
    v-if="mapData && choroplethdata"
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
          },
          hover: {
            fill: feature.color,
            stroke: 'black',
            opacity: 0.8,
          },
        }"
      />
      <MapMesh stroke="gray" />
    </MapFeatures>
  </Map>
</template>

<script setup lang="ts">
import { extent } from 'd3-array'
import { scaleLinear } from 'd3-scale'
import { withBase } from 'vitepress'
import { computed, onMounted, ref } from 'vue'

interface CountryStat {
  id: string
  value: number
}

const mapData = ref<unknown>()
const loading = ref(true)
const error = ref(false)
const choroplethdata = ref<CountryStat[]>([])

const minAndMaxValues = computed(() => extent(choroplethdata.value, (item) => item.value))
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
  const response = await fetch(withBase('/example-data/countries-110m.json'))
  mapData.value = await response.json()
}

async function fetchData() {
  const response = await fetch(withBase('/example-data/choropleth-data.json'))
  const rawData = await response.json()
  choroplethdata.value = rawData.map((item) => {
    const id = item['country-code']
    return {
      ...item,
      id,
      value: Number(id),
    }
  })
}

function dataTransformer(features: any[]) {
  return features.map((feature) => {
    const country = choroplethdata.value.find((item) => item.id === feature.id)
    const colorValue = country ? colorScale.value(country.value) : '#eee'

    return { ...feature, color: colorValue }
  })
}
</script>
