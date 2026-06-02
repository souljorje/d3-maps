<template>
  <g data-d3m="features">
    <slot :features="features">
      <MapFeature
        v-for="{ key, d } in features"
        :key="key"
        :d="d"
        :styles="styles"
      />
    </slot>
  </g>
</template>

<script setup lang="ts" generic="TExtra extends object = object">
import type {
  MapFeatureRendered,
  MapFeaturesProps,
} from '@d3-maps/core'
import type { StyleValue } from 'vue'

import { makeMapFeatures } from '@d3-maps/core'
import { computed } from 'vue'

import { useMapContext } from '../hooks/useMapContext'
import MapFeature from './MapFeature.vue'

const props = defineProps<MapFeaturesProps<TExtra, StyleValue>>()

defineSlots<{
  default?: (props: { features: MapFeatureRendered<TExtra>[] }) => unknown
}>()

const context = useMapContext()
const features = computed<MapFeatureRendered<TExtra>[]>(() => {
  return makeMapFeatures<TExtra>(context.value, {
    data: props.data,
    objectKey: props.objectKey,
    transformer: props.transformer,
    getKey: props.getKey,
  })
})
</script>
