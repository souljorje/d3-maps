<template>
  <MapBase
    v-if="data"
  >
    <MapSphere
      fill="var(--vp-c-bg-alt)"
      stroke="var(--vp-c-border)"
    >
      <MapGraticule />
      <MapFeatures :data="data" />
      <MapMesh :data="data" />
    </MapSphere>
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
  const { default: mapData } = await import('@d3-maps/atlas/world/countries')
  data.value = mapData
})
</script>
