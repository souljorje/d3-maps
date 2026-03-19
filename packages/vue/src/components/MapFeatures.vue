<template>
  <g name="features">
    <slot :features="features">
      <MapFeature
        v-for="(feature, index) in features"
        :key="getFeatureKey(feature, idKey, index)"
        :data="feature"
        :styles="styles"
      />
    </slot>
  </g>
</template>

<script setup lang="ts">
import type { MapObjectProps } from '@d3-maps/core'
import type { StyleValue } from 'vue'

import { getFeatureKey } from '@d3-maps/core'
import { computed } from 'vue'

import { useMapContext } from '../hooks/useMapContext'
import MapFeature from './MapFeature.vue'

interface MapFeaturesProps extends MapObjectProps<StyleValue> {
  idKey?: string
}

withDefaults(defineProps<MapFeaturesProps>(), {
  idKey: 'id',
})

const context = useMapContext()
const features = computed(() => (context?.value.features ?? []))
</script>
