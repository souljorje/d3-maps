<template>
  <MapBase
    v-if="choroplethData.length"
    :data-transformer="dataTransformer"
    :data="mapData"
  >
    <template #default="{ features }">
      <MapFeature
        v-for="feature in features"
        :key="String(feature.id)"
        :data="feature"
        :style="{
          fill: feature.color,
          stroke: '#777',
        }"
        :styles="{
          hover: {
            opacity: 0.8,
          },
        }"
      />
    </template>
  </MapBase>
</template>

<script setup lang="ts">
import { extent } from 'd3-array'
import { scaleLinear } from 'd3-scale'
import { withBase } from 'vitepress'
import { computed } from 'vue'

interface CountryStat {
  id: string
  value: number
}

const [mapData, rawData] = await Promise.all([
  import('world-atlas/countries-110m.json').then((m) => m.default),
  fetch(withBase('/example-data/choropleth-data.json')).then((r) => r.json()),
]) as [unknown, Array<Record<string, unknown>>]

const choroplethData: CountryStat[] = rawData.map((item) => {
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

const minAndMaxValues = computed(() => extent(choroplethData, (item) => item.value))
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

function dataTransformer(features: any[]) {
  return features.map((feature) => {
    const country = choroplethData.find((item) => item.id === feature.id)
    const colorValue = country ? colorScale.value(country.value) : ''

    return { ...feature, color: colorValue }
  })
}
</script>
