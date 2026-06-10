<template>
  <MapBase>
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
const { default: data } = await import('@d3-maps/atlas/world/countries/countries-110m')
</script>
