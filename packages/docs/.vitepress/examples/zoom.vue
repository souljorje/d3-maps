<template>
  <Map
    v-if="mapData"
    :data="mapData"
    :projection="projection"
  >
    <MapZoom @zoomend="updateMarkerScale">
      <MapFeatures />
      <MapMarker
        v-for="(item, index) in cities"
        :key="index"
        :coordinates="[item.lon, item.lat]"
      >
        <g :transform="`scale(${markerScale})`">
          <text
            font-size="16"
            y="-6"
            text-anchor="middle"
          >{{ item.city }}</text>
          <circle
            fill="#ff6f26"
            r="3"
          />
        </g>
      </MapMarker>
    </MapZoom>
  </Map>
</template>

<script setup lang="ts">
import type { D3ZoomEvent } from 'd3-zoom'

import { geoEqualEarth } from 'd3-geo'
import { withBase } from 'vitepress'
import { onMounted, ref } from 'vue'

interface City {
  city: string
  lon: number
  lat: number
}

const initialCities: City[] = [
  { city: 'Minsk', lon: 27.34, lat: 53.54 },
  { city: 'Dili', lon: 125.36, lat: -8.35 },
  { city: 'Dushanbe', lon: 68.48, lat: 38.35 },
  { city: 'Guatemala City', lon: -90.31, lat: 14.37 },
  { city: 'Njamena', lon: 12.1348, lat: 15.0557 },
  { city: 'Tokyo', lon: 139.45, lat: 35.41 },
  { city: 'Georgetown', lon: -58.1, lat: 6.48 },
]

const mapData = ref<unknown>()
const projection = geoEqualEarth
const cities = ref<City[]>(initialCities)
const markerScale = ref(1)
const currentZoom = ref(1)

onMounted(async () => {
  const response = await fetch(withBase('/example-data/countries-110m.json'))
  mapData.value = await response.json()
})

function updateMarkerScale(e: D3ZoomEvent<SVGSVGElement | SVGGElement, unknown>) {
  if (currentZoom.value === e.transform.k)
    return
  currentZoom.value = e.transform.k
  markerScale.value = 1 / e.transform.k
}
</script>
