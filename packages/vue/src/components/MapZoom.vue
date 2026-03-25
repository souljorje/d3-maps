<template>
  <g
    ref="container"
    name="zoom"
  >
    <slot />
  </g>
</template>

<script setup lang="ts">
import type {
  ZoomEvent,
  ZoomProps,
} from '@d3-maps/core'

import { getZoomViewportCenter } from '@d3-maps/core'
import { ref } from 'vue'

import { useMapContext } from '../hooks/useMapContext'
import { useCreateMapZoom } from '../hooks/useMapZoom'

const props = withDefaults(defineProps<ZoomProps>(), {
  zoom: 1,
  minZoom: 1,
  maxZoom: 8,
})

const emit = defineEmits<{
  (event: 'zoomStart', payload: ZoomEvent): void
  (event: 'zoom', payload: ZoomEvent): void
  (event: 'zoomEnd', payload: ZoomEvent): void
  (event: 'update:center', payload: [number, number]): void
  (event: 'update:zoom', payload: number): void
}>()

const container = ref<SVGGElement | null>(null)
const context = useMapContext()
const { zoomBehavior } = useCreateMapZoom(
  container,
  props,
  {
    onZoomStart: (event) => emit('zoomStart', event),
    onZoom: (event) => {
      emit('update:center', getZoomViewportCenter(context.value, event.transform))
      emit('update:zoom', event.transform.k)
      emit('zoom', event)
    },
    onZoomEnd: (event) => emit('zoomEnd', event),
  },
)

defineExpose({
  container,
  zoomBehavior,
})
</script>
