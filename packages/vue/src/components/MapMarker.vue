<template>
  <g
    :transform="transform"
    :style="computedStyle"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @mousedown="onMouseDown"
    @mouseup="onMouseUp"
    @click="onMouseUp"
    @focus="onFocus"
    @blur="onBlur"
  >
    <slot />
  </g>
</template>

<script setup lang="ts">
import type { MapMarkerProps } from '@d3-maps/core'
import type { StyleValue } from 'vue'
import type { MapObjectEmit } from '../lib/useMapObject'
import { getMarkerTransform } from '@d3-maps/core'
import { computed, toRef } from 'vue'
import { useMapObject } from '../lib/useMapObject'
import { useMapContext } from './MapContext'

const props = withDefaults(defineProps<MapMarkerProps<StyleValue>>(), {
  coordinates: () => [0, 0],
})

const emit = defineEmits<MapObjectEmit>()

const context = useMapContext()

const transform = computed(() => {
  return getMarkerTransform(context, props.coordinates)
})

const {
  computedStyle,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  onFocus,
  onBlur,
} = useMapObject(
  emit,
  toRef(props, 'styles'),
)
</script>
