<template>
  <g v-if="graticulePath">
    <path
      v-if="showBackground"
      :d="outlinePath"
      :fill="backgroundColor"
      pointer-events="none"
      name="background"
    />
    <path
      :d="graticulePath"
      :style="computedStyle"
      fill="none"
      :stroke="stroke"
      v-bind="$attrs"
      name="graticule"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
      @mousedown="onMouseDown"
      @mouseup="onMouseUp"
      @click="onMouseUp"
      @focus="onFocus"
      @blur="onBlur"
    />
    <path
      v-if="showBorder"
      :d="outlinePath"
      fill="none"
      :stroke="borderColor"
      pointer-events="none"
      name="border"
    />
  </g>
</template>

<script setup lang="ts">
import type { GraticuleConfig } from '@d3-maps/core'

import type {
  MapObjectEmit,
  MapObjectStyles,
} from '../hooks/useMapObject'

import {
  renderGraticule,
  renderOutline,
} from '@d3-maps/core'
import {
  computed,
  toRef,
} from 'vue'

import { useMapContext } from '../hooks/useMapContext'
import { useMapObject } from '../hooks/useMapObject'

interface Props {
  config?: GraticuleConfig
  background?: boolean | string
  border?: boolean | string
  stroke?: string
  styles?: MapObjectStyles
}

const props = defineProps<Props>()
const emit = defineEmits<MapObjectEmit>()
const context = useMapContext()

const graticulePath = computed(() => (
  context?.value && renderGraticule(context?.value, props.config)
))

const showBackground = computed(() => props.background === true || typeof props.background === 'string')
const showBorder = computed(() => props.border === true || typeof props.border === 'string')
const backgroundColor = computed(() => (
  typeof props.background === 'string' ? props.background : undefined
))
const borderColor = computed(() => (
  typeof props.border === 'string' ? props.border : undefined
))
const shouldRenderOutline = computed(() => showBackground.value || showBorder.value)

const outlinePath = computed(() => {
  if (!shouldRenderOutline.value || !context?.value) return ''
  return renderOutline(context.value) ?? ''
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
