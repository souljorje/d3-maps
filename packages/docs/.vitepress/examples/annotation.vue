<template>
  <MapBase
    v-if="data"
    :data="data"
  >
    <MapFeatures />
    <template
      v-for="sity in sities"
      :key="sity.name"
    >
      <MapAnnotation
        :coordinates="sity.coordinates"
        :stroke="sity.color"
        :length="40"
        :angle="195"
        :margin="4"
      >
        <text
          y="-4"
          text-anchor="middle"
          font-size="12"
          :fill="sity.color"
        >
          {{ sity.name }}
        </text>
      </MapAnnotation>
      <MapMarker :coordinates="sity.coordinates">
        <circle :fill="sity.color" r="3" />
      </MapMarker>
    </template>
  </MapBase>
</template>

<script setup lang="ts">
import type { MapData } from '@d3-maps/core'

import { withBase } from 'vitepress'
import { onMounted, ref } from 'vue'

interface Sity {
  name: string
  coordinates: [number, number]
  color: string
}

const data = ref<MapData>()
const sities: Sity[] = [
  {
    name: 'Paris',
    coordinates: [2.3522, 48.8566],
    color: '#ff6f26',
  },
  {
    name: 'New York',
    coordinates: [-73.935242, 40.73061],
    color: '#2563eb',
  },
]

onMounted(async () => {
  const response = await fetch(withBase('/example-data/countries-110m.json'))
  data.value = await response.json()
})
</script>
