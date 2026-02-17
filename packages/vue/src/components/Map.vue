<template>
  <MapProvider :context="context">
    <svg
      :viewBox="`0 0 ${context.width} ${context.height}`"
      v-bind="$attrs"
      class="d3-map"
    >
      <slot v-bind="context" />
    </svg>
  </MapProvider>
</template>

<script setup lang="ts">
import type {
  MapConfig,
  MapContext,
} from '@d3-maps/core'

import { makeMapContext } from '@d3-maps/core'
import { computed } from 'vue'

import { MapProvider } from './MapContext'

const props = defineProps<MapConfig>()

defineSlots<{
  default?: (props: MapContext) => unknown
}>()

const context = computed<MapContext>(() => makeMapContext({
  width: props.width,
  height: props.height,
  aspectRatio: props.aspectRatio,
  projection: props.projection,
  projectionConfig: props.projectionConfig,
  data: props.data,
  dataTransformer: props.dataTransformer,
}))
</script>
