<template>
  <g
    :transform="transform"
    :style="style"
    v-bind="events"
    name="marker"
  >
    <slot />
  </g>
</template>

<script setup lang="ts">
import type { MapMarkerProps } from '@d3-maps/core'
import type { StyleValue } from 'vue'

import { getMarkerTransform } from '@d3-maps/core'
import { computed, toRef } from 'vue'

import { useMapContext } from '../hooks/useMapContext'
import { useMapObject } from '../hooks/useMapObject'

const props = withDefaults(defineProps<MapMarkerProps<StyleValue>>(), {
  coordinates: () => [0, 0],
})

const context = useMapContext()

const transform = computed(() => {
  return getMarkerTransform(context?.value, props.coordinates)
})

const { style, ...events } = useMapObject(toRef(props, 'styles'))
</script>
