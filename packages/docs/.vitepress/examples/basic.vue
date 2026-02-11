<template>
  <Map
    v-if="mapData"
    :data="mapData"
  >
    <MapFeatures />
  </Map>
</template>

<script setup lang="ts">
import type { MapData } from '@d3-maps/core'
import { onMounted, ref } from 'vue'

const mapData = ref<MapData>()

onMounted(async () => {
  const response = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
  mapData.value = await response.json()
})
</script>
