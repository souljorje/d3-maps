<template>
  <MapBase
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
            fill="var(--vp-c-brand)"
            style="opacity: 0.85;"
            :r="setSize(item)"
            :transform="`scale(${markerScale})`"
          />
        </MapMarker>
      </g>
      <MapMesh />
    </MapZoom>
  </MapBase>
</template>

<script setup lang="ts">
import type { MapData, ZoomEvent } from '@d3-maps/vue'

import { getInverseZoomScale } from '@d3-maps/vue'
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

const projection = geoAlbersUsa
const markerScale = ref(1)
const data = ref<MapData | null>(null)
const cities = ref<City[]>([])

onMounted(async () => {
  const [mapData, citiesRaw] = await Promise.all([
    fetch(withBase('/example-data/states-10m.json')).then((r) => r.json()),
    fetch(withBase('/example-data/us-cities.json')).then((r) => r.json()),
  ]) as [MapData, City[]]

  data.value = mapData
  cities.value = citiesRaw
})

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

function updateMarkerScale(e: ZoomEvent) {
  markerScale.value = getInverseZoomScale(e)
}

const setSize = (item: City) => scale.value(item.population)
</script>
