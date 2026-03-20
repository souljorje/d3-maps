<template>
  <div style="aspect-ratio: 2 / 1">
    <MapBase
      v-if="data"
      :data="data"
      :data-transformer="dataTransformer"
      :projection="geoEquirectangular"
      :aspect-ratio="2 / 1"
    >
      <MapZoom>
        <MapGraticule border />
        <MapFeatures
          :styles="{
            default: { fill: 'lightblue' },
            hover: { fill: 'skyblue' },
            active: { fill: 'lightskyblue' },
          }"
        />
        <MapMesh stroke="#fff" />
        <MapMarker
          :coordinates="[-83.0457538, 42.331427]"
        >
          <text
            font-size="14"
            y="-6"
            text-anchor="middle"
          >
            Sweet home 🧡
          </text>
          <circle r="3" />
        </MapMarker>
      </MapZoom>
    </MapBase>
  </div>
</template>

<script setup lang="ts">
import type {
  DataTransformer,
  MapData,
} from '@d3-maps/core'

import { geoEquirectangular } from 'd3-geo'
import { withBase } from 'vitepress'
import {
  onMounted,
  ref,
} from 'vue'

const data = ref<MapData>()

const dataTransformer: DataTransformer = (features) => (
  features.filter((feature) => feature.properties?.name !== 'Antarctica')
)

onMounted(async () => {
  const response = await fetch(withBase('/example-data/countries-110m.json'))
  data.value = await response.json()
})
</script>
