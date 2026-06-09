<template>
  <MapBase :data="data">
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

const { default: data } = await import('world-atlas/countries-110m.json') as { default: MapData }
</script>
