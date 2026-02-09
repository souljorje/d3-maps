<template>
  <Map
    v-if="mapData"
    :data="mapData"
  >
    <MapFeatures />
  </Map>
</template>

<script setup lang="ts">
import type { Topology } from 'topojson-specification'
import { onMounted, ref } from 'vue'

const mapData = ref<Topology>()

onMounted(async () => {
  const response = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
  mapData.value = await response.json()
})
</script>
