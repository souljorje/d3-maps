<template>
  <MapBase
    v-if="data"
    :data="data"
  >
    <MapGraticule
      background
      border
    />
    <MapFeatures />
    <MapMesh />
  </MapBase>
</template>

<script setup lang="ts">
import type { MapData } from '@d3-maps/vue'

import {
  onMounted,
  ref,
} from 'vue'

const data = ref<MapData>()

onMounted(async () => {
  const { default: mapData } = await import('world-atlas/countries-110m.json')
  data.value = mapData
})
</script>
