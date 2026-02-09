<template>
  <g
    ref="container"
    class="vsm-zoom"
  >
    <slot />
  </g>
</template>

<script setup lang="ts">
import type {
  D3ZoomEvent,
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
import { useMapContext } from './MapContext'

const props = withDefaults(defineProps<ZoomProps>(), {
  center: () => [0, 0] as [number, number],
  zoom: 1,
  minZoom: 1,
  maxZoom: 8,
})

const emit = defineEmits<{
  (event: 'zoomstart', payload: D3ZoomEvent<SVGSVGElement, unknown>): void
  (event: 'zoom', payload: D3ZoomEvent<SVGSVGElement, unknown>): void
  (event: 'zoomend', payload: D3ZoomEvent<SVGSVGElement, unknown>): void
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
      immediate: true
    }
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

<style lang="css">
  .vsm-zoom path {
    vector-effect: non-scaling-stroke;
  }
</style>
