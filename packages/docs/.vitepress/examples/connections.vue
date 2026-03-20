<template>
  <MapBase
    v-if="data"
    :data="data"
  >
    <MapFeatures />

    <MapMarker
      v-for="city in cities"
      :key="city.name"
      :coordinates="city.coordinates"
    >
      <circle r="3" />
      <text
        :y="city.name === 'Tbilisi' ? -8 : 14"
        font-size="12"
        text-anchor="middle"
      >
        {{ city.name }}
      </text>
    </MapMarker>

    <!-- Line per each connection -->
    <MapLine
      v-for="[flightFrom, flightTo] in directFlights"
      :key="`${flightFrom.name}-${flightTo.name}`"
      :coordinates="[flightFrom.coordinates, flightTo.coordinates]"
      :stroke-width="1.5"
      marker-end="url(#connections-arrow)"
    />

    <!-- Single line for all connections -->
    <MapLine
      :coordinates="transitFlight"
      :stroke-width="1.5"
      stroke-dasharray="4 4"
      marker-end="url(#connections-arrow)"
    />

    <!-- Custom line end -->
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
  </MapBase>
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
  { name: 'Dubai ', coordinates: [55.2708, 25.2048] },
  { name: 'Tbilisi', coordinates: [44.793, 41.7151] },
]

const directFlights = [
  [cities[0], cities[1]],
  [cities[1], cities[2]],
  [cities[2], cities[3]],
]

const transitFlight = [
  cities[3].coordinates,
  cities[4].coordinates,
  cities[5].coordinates,
]

const data = ref<MapData>()

onMounted(async () => {
  const response = await fetch(withBase('/example-data/countries-110m.json'))
  data.value = await response.json()
})
</script>
