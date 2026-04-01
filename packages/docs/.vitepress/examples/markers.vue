<template>
  <MapBase
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
        font-size="12"
        y="-8"
        text-anchor="middle"
      >
        {{ item.city }}
      </text>
      <circle
        r="3"
      />
    </MapMarker>
  </MapBase>
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
  const { default: mapData } = await import('world-atlas/countries-110m.json')
  data.value = mapData
})
</script>
