<template>
  <MapProvider :context="context">
    <svg
      :viewBox="`0 0 ${width} ${height}`"
      v-bind="$attrs"
      width="100%"
      height="100%"
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

// TODO: rework default width & height
const props = withDefaults(defineProps<MapConfig>(), {
  width: 680,
  height: 680 * 0.55,
})

defineSlots<{
  default?: (props: MapContext) => unknown
}>()

const context = computed<MapContext>(() => makeMapContext({
  width: props.width,
  height: props.height,
  projection: props.projection,
  projectionConfig: props.projectionConfig,
  data: props.data,
  dataTransformer: props.dataTransformer,
}))
</script>
