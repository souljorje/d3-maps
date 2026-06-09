<template>
  <g
    ref="container"
    name="zoom"
  >
    <slot />
  </g>
</template>

<script setup lang="ts">
import type { ZoomEvent, ZoomProps } from '@d3-maps/core'

import { ZOOM_DEFAULTS } from '@d3-maps/core'
import { useTemplateRef } from 'vue'

import { useCreateMapZoom } from '../hooks/useCreateMapZoom'

const props = withDefaults(defineProps<ZoomProps>(), ZOOM_DEFAULTS)

const emit = defineEmits<{
  (event: 'zoomStart', payload: ZoomEvent): void
  (event: 'zoom', payload: ZoomEvent): void
  (event: 'zoomEnd', payload: ZoomEvent): void
}>()

const container = useTemplateRef('container')

const {
  commands,
  zoomBehavior,
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
  zoomBehavior,
  ...commands,
})
</script>
