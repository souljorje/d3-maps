<template>
  <g
    ref="container"
    class="d3-map-zoom"
  >
    <slot />
  </g>
</template>

<script setup lang="ts">
import type {
  ZoomEvent,
  ZoomProps,
} from '@d3-maps/core'

import {
  applyZoomGroupTransform,
  applyZoomTransform,
  createZoomBehavior,
  setupZoom,
} from '@d3-maps/core'
import {
  computed,
  onMounted,
  ref,
  watch,
} from 'vue'

import { useMapContext } from '../hooks/useMapContext'

const props = withDefaults(defineProps<ZoomProps>(), {
  center: () => [0, 0] as [number, number],
  zoom: 1,
  minZoom: 1,
  maxZoom: 8,
})

const emit = defineEmits<{
  (event: 'zoomstart', payload: ZoomEvent): void
  (event: 'zoom', payload: ZoomEvent): void
  (event: 'zoomend', payload: ZoomEvent): void
}>()

const container = ref<SVGGElement | null>(null)
const context = useMapContext()

const zoomBehavior = computed(() => {
  return createZoomBehavior(context?.value, {
    minZoom: props.minZoom,
    maxZoom: props.maxZoom,
    config: props.config,
    onZoomStart: (event) => emit('zoomstart', event),
    onZoom: (event) => {
      applyZoomGroupTransform(container.value, event.transform)
      emit('zoom', event)
    },
    onZoomEnd: (event) => emit('zoomend', event),
  })
})

onMounted(() => {
  watch(
    zoomBehavior,
    (behavior) => {
      if (!container.value) return
      setupZoom({
        element: container.value,
        behavior,
        center: props.center,
        zoom: props.zoom,
      })
    },
    {
      immediate: true,
    },
  )
  watch(
    () => [zoomBehavior.value, props.center[0], props.center[1], props.zoom],
    () => {
      if (!container.value) return
      applyZoomTransform({
        element: container.value,
        behavior: zoomBehavior.value,
        center: props.center,
        zoom: props.zoom,
      })
    },
  )
})

defineExpose({
  container,
  zoomBehavior,
})
</script>
