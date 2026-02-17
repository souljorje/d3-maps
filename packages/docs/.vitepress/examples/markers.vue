<template>
  <Map
    v-if="data"
    :data="data"
  >
    <MapFeatures />
    <MapMarker
      v-for="item in cities"
      :key="item.city"
      :coordinates="[item.lon, item.lat]"
    >
      <text
        font-size="16"
        y="-6"
        text-anchor="middle"
      >{{ item.city }}</text>
      <circle
        fill="#ff6f26"
        r="3"
      />
    </MapMarker>
  </Map>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface City {
  city: string
  lon: number
  lat: number
}

const cities: City[] = [
  { city: 'Minsk', lon: 27.34, lat: 53.54 },
  { city: 'Dili', lon: 125.36, lat: -8.35 },
  { city: 'Dushanbe', lon: 68.48, lat: 38.35 },
  { city: 'Njamena', lon: 12.1348, lat: 15.0557 },
  { city: 'Malabo', lon: 8.47, lat: 3.45 },
  { city: 'Tokyo', lon: 139.45, lat: 35.41 },
  { city: 'Georgetown', lon: -58.1, lat: 6.48 },
]

const data = ref<unknown>()

onMounted(async () => {
  const response = await fetch('/example-data/countries-110m.json')
  data.value = await response.json()
})
</script>
