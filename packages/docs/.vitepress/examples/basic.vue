<template>
  <MapBase
    v-if="data"
    :data="data"
  >
    <MapFeatures />
    <MapMesh />
  </MapBase>
</template>

<script setup lang="ts">
import type { MapData } from '@d3-maps/vue'

import { onMounted, ref } from 'vue'

const data = ref<MapData>()

onMounted(async () => {
  const { default: mapData } = await import('@d3-maps/atlas/world/countries/countries-110m')
  data.value = mapData
})
</script>
