<template>
  <g
    ref="container"
    name="zoom"
  >
    <slot />
  </g>
</template>

<script setup lang="ts">
import type { ZoomEvent } from '@d3-maps/core'

import type { MapZoomProps } from '../hooks/useCreateMapZoom'

import { ref } from 'vue'

import { useCreateMapZoom } from '../hooks/useCreateMapZoom'

const props = withDefaults(defineProps<MapZoomProps>(), {
  minZoom: 1,
  maxZoom: 8,
})

const emit = defineEmits<{
  (event: 'zoomStart', payload: ZoomEvent): void
  (event: 'zoom', payload: ZoomEvent): void
  (event: 'zoomEnd', payload: ZoomEvent): void
}>()

const container = ref<SVGGElement | null>(null)

const {
  reset,
  zoomBehavior,
  zoomBy,
  zoomTo,
  zoomToFeature,
  zoomToScale,
} = useCreateMapZoom(
  container,
  props,
  {
    onZoomStart: (event) => emit('zoomStart', event),
    onZoom: (event) => emit('zoom', event),
    onZoomEnd: (event) => emit('zoomEnd', event),
  },
)

defineExpose({
  container,
  reset,
  zoomBehavior,
  zoomBy,
  zoomTo,
  zoomToFeature,
  zoomToScale,
})
</script>
