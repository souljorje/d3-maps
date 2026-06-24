<template>
  <MapBase
    v-if="data"
  >
    <MapFeatures :data="data" />
    <MapMesh :data="data" />
  </MapBase>
</template>

<script setup lang="ts">
const { default: data } = await import('@d3-maps/atlas/world/countries/countries-110m')
</script>
