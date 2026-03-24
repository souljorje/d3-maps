<template>
  <MapBase
    v-if="data"
    :data="data"
  >
    <MapFeatures />
    <template
      v-for="city in cities"
      :key="city.name"
    >
      <MapAnnotation
        :coordinates="city.coordinates"
        :stroke="city.color"
        :length="35"
        :angle="-165"
        :margin="2"
        :stroke-width="2"
      >
        <text
          y="-5"
          text-anchor="middle"
          font-size="12"
          :fill="city.color"
        >
          {{ city.name }}
        </text>
      </MapAnnotation>
      <MapMarker :coordinates="city.coordinates">
        <circle :fill="city.color" r="3" />
      </MapMarker>
    </template>
  </MapBase>
</template>

<script setup lang="ts">
import type { MapData } from '@d3-maps/core'

import { withBase } from 'vitepress'
import { onMounted, ref } from 'vue'

interface City {
  name: string
  coordinates: [number, number]
  color: string
}

const data = ref<MapData>()
const cities: City[] = [
  {
    name: 'Paris',
    coordinates: [2.3522, 48.8566],
    color: '#ff6f26',
  },
  {
    name: 'New York',
    coordinates: [-73.935242, 40.73061],
    color: '#60a5fa',
  },
]

onMounted(async () => {
  const response = await fetch(withBase('/example-data/countries-110m.json'))
  data.value = await response.json()
})
</script>
