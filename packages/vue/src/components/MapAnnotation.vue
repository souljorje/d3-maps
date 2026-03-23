<template>
  <MapMarker
    :coordinates="coordinates"
    name="annotation"
  >
    <g :transform="geometry.lineTransform">
      <MapLine
        v-bind="$attrs"
        :coordinates="geometry.lineCoordinates"
        cartesian
        :curve="curve"
        :midpoint="midpoint"
        :styles="styles"
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
import { computed } from 'vue'

import MapLine from './MapLine.vue'
import MapMarker from './MapMarker.vue'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<MapAnnotationProps<StyleValue>>()

const geometry = computed(() => (
  getAnnotationGeometry({
    length: props.length,
    angle: props.angle,
    margin: props.margin,
  })
))
</script>
