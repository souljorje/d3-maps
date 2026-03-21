<template>
  <MapMarker
    :coordinates="coordinates"
    name="annotation"
    v-on="events"
  >
    <g :transform="geometry.lineTransform">
      <path
        v-bind="$attrs"
        :d="geometry.linePath"
        :style="style"
        fill="none"
        name="annotation-line"
      />
    </g>
    <g
      :transform="geometry.contentTransform"
      name="annotation-content"
    >
      <slot />
    </g>
  </MapMarker>
</template>

<script setup lang="ts">
import type { MapAnnotationProps } from '@d3-maps/core'
import type { StyleValue } from 'vue'

import { getAnnotationGeometry } from '@d3-maps/core'
import {
  computed,
  toRef,
} from 'vue'

import { useMapObject } from '../hooks/useMapObject'
import MapMarker from './MapMarker.vue'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<MapAnnotationProps<StyleValue>>()
const { style, ...events } = useMapObject(toRef(props, 'styles'))

const geometry = computed(() => (
  getAnnotationGeometry({
    length: props.length,
    angle: props.angle,
    margin: props.margin,
    curve: props.curve,
  })
))
</script>
