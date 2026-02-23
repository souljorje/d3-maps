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
  return createZoomBehavior(context, {
    minZoom: props.minZoom,
    maxZoom: props.maxZoom,
    translateExtent: props.translateExtent,
    modifiers: props.modifiers,
    onZoomStart: (event) => emit('zoomstart', event),
    onZoom: (event) => {
      if (container.value) {
        container.value.setAttribute('transform', event.transform.toString())
      }
      emit('zoom', event)
    },
    onZoomEnd: (event) => emit('zoomend', event),
  })
})

onMounted(() => {
  watch(
    () => [zoomBehavior],
    () => setupZoom({
      element: container.value,
      behavior: zoomBehavior.value,
      center: props.center,
      zoom: props.zoom,
    }),
    {
      immediate: true,
    },
  )
  watch(
    () => [props.center[0], props.center[1], props.zoom],
    () => applyZoomTransform({
      element: container.value,
      behavior: zoomBehavior.value,
      center: props.center,
      zoom: props.zoom,
    }),
  )
})

defineExpose({
  container,
  zoomBehavior,
})
</script>
