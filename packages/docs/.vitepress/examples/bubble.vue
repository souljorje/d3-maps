<template>
  <Map
    v-if="data"
    :projection="projection"
    :data="data"
  >
    <MapZoom
      :max-zoom="100"
      @zoom="updateMarkerScale"
    >
      <MapFeatures />
      <g>
        <MapMarker
          v-for="(item, index) in cities"
          :key="index"
          :coordinates="[item.longitude, item.latitude]"
        >
          <circle
            fill="#ff6f2695"
            :r="setSize(item)"
            :transform="`scale(${markerScale})`"
          />
        </MapMarker>
      </g>
      <MapMesh stroke="slategray" />
    </MapZoom>
  </Map>
</template>

<script setup lang="ts">
import type { ZoomEvent } from '@d3-maps/core'

import { getInverseZoomScale } from '@d3-maps/core'
import { extent } from 'd3-array'
import { geoAlbersUsa } from 'd3-geo'
import { scaleLinear } from 'd3-scale'
import { withBase } from 'vitepress'
import { computed, onMounted, ref } from 'vue'

interface City {
  city: string
  latitude: number
  longitude: number
  population: number
}

const data = ref<unknown>()
const projection = geoAlbersUsa
const cities = ref<City[]>([])
const markerScale = ref(1)
const loading = ref(true)
const error = ref(false)

const minAndMaxValues = computed(() => extent(cities.value, (item) => Number(item.population)))
const scale = computed(() => {
  const domain = minAndMaxValues.value
  const safeDomain: [number, number] = [
    domain?.[0] ?? 0,
    domain?.[1] ?? 1,
  ]
  return scaleLinear()
    .domain(safeDomain)
    .range([3, 35])
})

onMounted(async () => {
  try {
    await Promise.all([fetchMap(), fetchData()])
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
})

function updateMarkerScale(e: ZoomEvent) {
  markerScale.value = getInverseZoomScale(e)
}

const setSize = (item: City) => scale.value(item.population)

async function fetchMap() {
  const response = await fetch(withBase('/example-data/states-10m.json'))
  data.value = await response.json()
}

async function fetchData() {
  const response = await fetch(withBase('/example-data/us-cities.json'))
  cities.value = await response.json()
}
</script>
