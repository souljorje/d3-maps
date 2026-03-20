<template>
  <g>
    <path
      v-if="background"
      :d="outlinePath"
      :fill="backgroundColor"
      pointer-events="none"
      name="background"
    />
    <path
      :d="graticulePath"
      fill="none"
      :style="style"
      v-bind="mergeProps(events, attrs)"
      name="graticule"
    />
    <path
      v-if="border"
      :d="outlinePath"
      fill="none"
      :stroke="borderColor"
      pointer-events="none"
      name="border"
    />
  </g>
</template>

<script setup lang="ts">
import type {
  GraticuleConfig,
  MapObject,
} from '@d3-maps/core'
import type { StyleValue } from 'vue'

import {
  isString,
  renderGraticule,
  renderOutline,
} from '@d3-maps/core'
import {
  computed,
  mergeProps,
  toRef,
  useAttrs,
} from 'vue'

import { useMapContext } from '../hooks/useMapContext'
import { useMapObject } from '../hooks/useMapObject'

interface Props extends MapObject<StyleValue> {
  config?: GraticuleConfig
  background?: boolean | string
  border?: boolean | string
}

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<Props>()
const context = useMapContext()
const attrs = useAttrs()

const graticulePath = computed(() => {
  return renderGraticule(context.value, props.config) ?? undefined
})

const outlinePath = computed(() => {
  return renderOutline(context.value) ?? undefined
})

const backgroundColor = computed(() => (
  isString(props.background) ? props.background : undefined
))
const borderColor = computed(() => (
  isString(props.border) ? props.border : undefined
))

const { style, ...events } = useMapObject(toRef(props, 'styles'))
</script>
