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
import { withBase } from 'vitepress'
import { onMounted, ref } from 'vue'

const mapData = ref<MapData>()

onMounted(async () => {
  const response = await fetch(withBase('/example-data/countries-110m.json'))
  mapData.value = await response.json()
})
</script>
