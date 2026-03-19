<template>
  <svg
    :viewBox="`0 0 ${context.width} ${context.height}`"
    v-bind="$attrs"
    class="d3-map"
  >
    <slot v-bind="context" />
  </svg>
</template>

<script setup lang="ts">
import type {
  MapConfig,
  MapContext,
} from '@d3-maps/core'

import { makeMapContext } from '@d3-maps/core'
import {
  computed,
  provide,
} from 'vue'

import { mapContextKey } from '../hooks/useMapContext'

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

provide(mapContextKey, context)
</script>
