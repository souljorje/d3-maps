<template>
  <MapBase :fit="sampleGeoJson">
    <MapFeatures
      :data="sampleGeoJson"
      :transformer="transformer"
    >
      <template #default="{ features }">
        <MapFeature
          v-for="feature in features"
          :key="feature.key"
          :d="feature.d"
          :fill="feature.color"
        />
      </template>
    </MapFeatures>
  </MapBase>
</template>

<script setup lang="ts">
import type {
  MapFeatureTransformer,
} from '@d3-maps/core'

import {
  MapBase,
  MapFeature,
  MapFeatures,
} from '../src'
import { sampleGeoJson } from './fixtures'

interface ColoredFeatureExtra {
  color: string
}

const transformer: MapFeatureTransformer<ColoredFeatureExtra> = (features) => {
  return features.map((feature) => ({
    ...feature,
    color: 'darkorange',
  }))
}
</script>
