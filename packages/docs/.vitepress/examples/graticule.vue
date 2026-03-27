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

import { withBase } from 'vitepress'
import {
  onMounted,
  ref,
} from 'vue'

const data = ref<MapData>()

onMounted(async () => {
  const response = await fetch(withBase('/example-data/countries-110m.json'))
  data.value = await response.json()
})
</script>
