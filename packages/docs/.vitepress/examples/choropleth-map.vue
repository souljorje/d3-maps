<template>
  <MapBase
    v-if="mapData && choroplethData.length"
  >
    <MapFeatures
      v-slot="{ features }"
      :data="mapData"
      :transformer="transformer"
    >
      <template
        v-for="feature in features"
        :key="String(feature.key)"
      >
        <MapObject
          v-if="feature.type === 'Feature'"
          :d="feature.d"
          data-d3m="feature"
          :style="{
            fill: getFeatureColor(feature),
            stroke: '#777',
          }"
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
  MapFeatureData,
  MapFeatureTransformer,
} from '@d3-maps/vue'

import { extent } from 'd3-array'
import { scaleLinear } from 'd3-scale'
import { withBase } from 'vitepress'
import { computed, onMounted, ref } from 'vue'

interface CountryStat {
  id: string
  value: number
}

const mapData = ref<MapData>()
const loading = ref(true)
const error = ref(false)
const choroplethData = ref<CountryStat[]>([])

const minAndMaxValues = computed(() => extent(choroplethData.value, (item) => item.value))
const colorScale = computed(() => {
  const domain = minAndMaxValues.value
  const safeDomain: [number, number] = [
    domain?.[0] ?? 0,
    domain?.[1] ?? 1,
  ]
  return scaleLinear<string>()
    .domain(safeDomain)
    .range(['#e0460030', '#e04600'])
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
  const { default: data } = await import('@d3-maps/atlas/world/countries')
  mapData.value = data
}

async function fetchData() {
  const response = await fetch(withBase('/example-data/choropleth-data.json'))
  const rawData = (await response.json()) as Array<Record<string, unknown>>
  choroplethData.value = rawData.map((item) => {
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

const transformer: MapFeatureTransformer = (features) => {
  return features.map((feature) => {
    if (feature.type !== 'Feature') return feature

    const country = choroplethData.value.find((item) => item.id === String(feature.id))
    const colorValue = country ? colorScale.value(country.value) : ''

    return { ...feature, color: colorValue }
  })
}

function getFeatureColor(feature: MapFeatureData): string {
  return String((feature as MapFeatureData & { color?: string }).color ?? '')
}
</script>
