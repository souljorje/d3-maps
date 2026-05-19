<template>
  <MapBase
    v-if="data"
    :data="data"
  >
    <MapGraticule
      background
      border
    />
    <MapObjects />
    <MapMesh />
  </MapBase>
</template>

<script setup lang="ts">
import type { MapDataSource } from '@d3-maps/vue'

import {
  onMounted,
  ref,
} from 'vue'

const data = ref<MapDataSource>()

onMounted(async () => {
  const { default: mapData } = await import('@d3-maps/atlas/world/countries')
  data.value = mapData
})
</script>
