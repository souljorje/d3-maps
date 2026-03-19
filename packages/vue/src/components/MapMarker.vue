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
import type { MapMarkerProps as CoreMapMarkerProps } from '@d3-maps/core'
import type { StyleValue } from 'vue'

import { getMarkerTransform } from '@d3-maps/core'
import {
  computed,
  toRef,
} from 'vue'

import { useMapContext } from '../hooks/useMapContext'
import { useMapObject } from '../hooks/useMapObject'

type MapMarkerProps = CoreMapMarkerProps<StyleValue>

const props = withDefaults(defineProps<MapMarkerProps>(), {
  coordinates: () => [0, 0],
})

const context = useMapContext()

const transform = computed(() => {
  return getMarkerTransform(context?.value, props.coordinates)
})

const { style, ...events } = useMapObject(toRef(props, 'styles'))
</script>
