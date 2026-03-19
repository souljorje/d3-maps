<template>
  <g
    v-if="geometry"
    :transform="geometry.anchorTransform"
    name="annotation"
  >
    <g :transform="geometry.connectorTransform">
      <path
        :d="geometry.connectorPath"
        :style="style"
        fill="none"
        v-bind="pathAttrs"
      />
    </g>
    <g
      :transform="geometry.contentTransform"
      name="annotation-content"
    >
      <slot />
    </g>
  </g>
</template>

<script setup lang="ts">
import type { MapAnnotationProps } from '@d3-maps/core'
import type { StyleValue } from 'vue'

import { getAnnotationGeometry } from '@d3-maps/core'
import {
  computed,
  toRef,
  useAttrs,
} from 'vue'

import { useMapContext } from '../hooks/useMapContext'
import { useMapObject } from '../hooks/useMapObject'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<MapAnnotationProps<StyleValue>>()
const attrs = useAttrs()

const context = useMapContext()
const { style, ...events } = useMapObject(toRef(props, 'styles'))
const name = computed(() => {
  return typeof attrs.name === 'string' ? attrs.name : 'annotation-line'
})
const pathAttrs = computed(() => {
  return {
    ...attrs,
    ...events,
    name: name.value,
  }
})

const geometry = computed(() => {
  return getAnnotationGeometry(context?.value, props.coordinates, {
    length: props.length,
    angle: props.angle,
    margin: props.margin,
  })
})
</script>
