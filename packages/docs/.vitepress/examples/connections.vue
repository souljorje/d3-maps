<template>
  <Map
    v-if="data"
    :data="data"
  >
    <MapFeatures />
    <MapMesh />

    <MapMarker
      v-for="city in cities"
      :key="city.name"
      :coordinates="city.coordinates"
    >
      <circle r="3" />
      <text
        y="-8"
        font-size="12"
        text-anchor="middle"
      >{{ city.name }}</text>
    </MapMarker>

    <MapLine
      v-for="connection in connections"
      :key="connection.id"
      :coordinates="connection.coordinates"
      curve
      marker-end="url(#connections-arrow)"
    />

    <defs>
      <marker
        id="connections-arrow"
        viewBox="0 0 10 10"
        refX="14"
        refY="5"
        markerWidth="5"
        markerHeight="5"
        orient="auto-start-reverse"
      >
        <path
          d="M 0 0 L 10 5 L 0 10 z"
          fill="var(--vp-c-brand-3)"
        />
      </marker>
    </defs>
  </Map>
</template>

<script setup lang="ts">
import type { MapData } from '@d3-maps/core'

import { withBase } from 'vitepress'
import { onMounted, ref } from 'vue'

const cities = [
  { name: 'San Francisco', coordinates: [-122.4194, 37.7749] },
  { name: 'New York', coordinates: [-73.935242, 40.73061] },
  { name: 'London', coordinates: [-0.1276, 51.5072] },
  { name: 'Tokyo', coordinates: [139.6503, 35.6762] },
]

const connections = [
  { id: 'sf-nyc', coordinates: [cities[0].coordinates, cities[1].coordinates] },
  { id: 'nyc-london', coordinates: [cities[1].coordinates, cities[2].coordinates] },
  { id: 'london-tokyo', coordinates: [cities[2].coordinates, cities[3].coordinates] },
]

const data = ref<MapData>()

onMounted(async () => {
  const response = await fetch(withBase('/example-data/countries-110m.json'))
  data.value = await response.json()
})
</script>
