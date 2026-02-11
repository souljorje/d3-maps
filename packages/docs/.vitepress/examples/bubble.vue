<template>
  <div v-if="loading">
    Loading...
  </div>
  <div v-else-if="error">
    An error occurred
  </div>
  <Map
    v-else
    :projection="projection"
    :data="mapData"
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
            fill="#ff6f26"
            :r="setSize(item)"
            :transform="`scale(${markerScale})`"
          />
        </MapMarker>
      </g>
    </MapZoom>
  </Map>
</template>

<script setup lang="ts">
import type { ZoomEvent } from '@d3-maps/core'
import { extent } from 'd3-array'
import { geoAlbersUsa } from 'd3-geo'
import { scaleLinear } from 'd3-scale'
import { computed, onMounted, ref } from 'vue'

interface City {
  city: string
  latitude: number
  longitude: number
  population: number
}

const mapData = ref<unknown>()
const projection = geoAlbersUsa
const cities = ref<City[]>([])
const markerScale = ref(1)
const currentZoom = ref(1)
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
  if (currentZoom.value === e.transform.k) return

  currentZoom.value = e.transform.k
  const scaleFactor = e.transform.k !== 1 ? e.transform.k / 2 : e.transform.k
  markerScale.value = 1 / scaleFactor
}

const setSize = (item: City) => scale.value(item.population)

async function fetchMap() {
  const response = await fetch('https://unpkg.com/us-atlas@3.0.0/states-10m.json')
  mapData.value = await response.json()
}

async function fetchData() {
  const response = await fetch('https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json')
  cities.value = await response.json()
}
</script>
