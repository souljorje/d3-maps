<template>
  <MapBase
    v-if="mapData && choroplethData.length"
    :data-transformer="dataTransformer"
    :data="mapData"
  >
    <MapObjects v-slot="{ objects }">
      <template
        v-for="object in objects"
        :key="String(object.key)"
      >
        <MapObject
          v-if="object.type === 'Feature'"
          :d="object.d"
          name="object"
          :style="{
            fill: getFeatureColor(object),
            stroke: '#777',
          }"
          :styles="{
            hover: {
              opacity: 0.8,
            },
          }"
        />
      </template>
    </MapObjects>
  </MapBase>
</template>

<script setup lang="ts">
import type {
  MapDataItem,
  MapDataSource,
  MapDataTransformer,
} from '@d3-maps/vue'

import { extent } from 'd3-array'
import { scaleLinear } from 'd3-scale'
import { withBase } from 'vitepress'
import { computed, onMounted, ref } from 'vue'

interface CountryStat {
  id: string
  value: number
}

const mapData = ref<MapDataSource>()
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

const dataTransformer: MapDataTransformer = (objects) => {
  return objects.map((object) => {
    if (object.type !== 'Feature') return object

    const country = choroplethData.value.find((item) => item.id === String(object.id))
    const colorValue = country ? colorScale.value(country.value) : ''

    return { ...object, color: colorValue }
  })
}

function getFeatureColor(feature: MapDataItem): string {
  return String((feature as MapDataItem & { color?: string }).color ?? '')
}
</script>
