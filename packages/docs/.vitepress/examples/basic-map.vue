<template>
  <MapBase
    v-if="data"
  >
    <MapFeatures :data="data" />
    <MapMesh :data="data" />
  </MapBase>
</template>

<script setup lang="ts">
import type { MapData } from '@d3-maps/vue'

const { default: data } = await import('@d3-maps/atlas/world/countries/countries-110m') as { default: MapData }
</script>
