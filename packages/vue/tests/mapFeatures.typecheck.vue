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
import type { MapFeatureData } from '@d3-maps/core'

import {
  MapBase,
  MapFeature,
  MapFeatures,
} from '../src'
import { sampleGeoJson } from './fixtures'

type ColoredFeature = MapFeatureData & {
  color: string
}

function transformer(features: readonly MapFeatureData[]): ColoredFeature[] {
  return features.map((feature) => ({
    ...feature,
    color: 'darkorange',
  }))
}
</script>
