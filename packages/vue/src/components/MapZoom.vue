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

import {
  applyZoom,
  applyZoomGroupTransform,
  createZoomBehavior,
  setupZoom,
} from '@d3-maps/core'
import {
  computed,
  onMounted,
  provide,
  ref,
  watch,
} from 'vue'

import { insideZoomKey } from '../hooks/useInsideZoom'
import { useMapContext } from '../hooks/useMapContext'

const props = withDefaults(defineProps<ZoomProps>(), {
  zoom: 1,
  minZoom: 1,
  maxZoom: 8,
})

const emit = defineEmits<{
  (event: 'zoomStart', payload: ZoomEvent): void
  (event: 'zoom', payload: ZoomEvent): void
  (event: 'zoomEnd', payload: ZoomEvent): void
}>()

const container = ref<SVGGElement | null>(null)
const context = useMapContext()

provide(insideZoomKey, true)

const zoomBehavior = computed(() => {
  return createZoomBehavior(context?.value, {
    minZoom: props.minZoom,
    maxZoom: props.maxZoom,
    config: props.config,
    onZoomStart: (event) => emit('zoomStart', event),
    onZoom: (event) => {
      applyZoomGroupTransform(container.value, event.transform)
      emit('zoom', event)
    },
    onZoomEnd: (event) => emit('zoomEnd', event),
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
        transition: props.transition,
      })
    },
    {
      immediate: true,
    },
  )
  watch(
    () => [
      zoomBehavior.value,
      props.center?.[0],
      props.center?.[1],
      props.zoom,
      props.transition?.duration,
      props.transition?.delay,
      props.transition?.ease,
    ],
    () => {
      if (!container.value) return
      applyZoom({
        element: container.value,
        behavior: zoomBehavior.value,
        center: props.center,
        zoom: props.zoom,
        transition: props.transition,
      })
    },
  )
})

defineExpose({
  container,
  zoomBehavior,
})
</script>
