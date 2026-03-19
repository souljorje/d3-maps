<template>
  <Map
    v-if="data"
    :data="data"
  >
    <MapFeatures />
    <MapAnnotation
      :coordinates="[2.3522, 48.8566]"
      :length="36"
      :angle="-35"
      :margin="10"
      :stroke-width="2"
      stroke="#ff6f26"
    >
      <text
        y="-8"
        text-anchor="middle"
        font-size="12"
      >Paris</text>
    </MapAnnotation>
    <MapAnnotation
      :coordinates="[-73.935242, 40.73061]"
      :length="52"
      :angle="-20"
      :margin="4"
      :stroke-width="2"
      stroke="#2563eb"
    >
      <text
        y="-8"
        text-anchor="middle"
        font-size="12"
      >New York</text>
    </MapAnnotation>
  </Map>
</template>

<script setup lang="ts">
import type { MapData } from '@d3-maps/core'

import { withBase } from 'vitepress'
import { onMounted, ref } from 'vue'

const data = ref<MapData>()

onMounted(async () => {
  const response = await fetch(withBase('/example-data/countries-110m.json'))
  data.value = await response.json()
})
</script>
