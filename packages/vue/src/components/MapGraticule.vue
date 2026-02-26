<template>
  <g>
    <path
      v-if="showBackground"
      :d="outlinePath"
      :fill="backgroundColor"
      pointer-events="none"
      name="background"
    />
    <path
      :d="graticulePath"
      fill="none"
      :style="style"
      v-bind="{ ...$attrs, ...events }"
      name="graticule"
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
  styles?: MapObjectStyles
}

const props = defineProps<Props>()
const context = useMapContext()

const graticulePath = computed(() => {
  if (!context?.value) return undefined
  return renderGraticule(context.value, props.config) ?? undefined
})

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
  if (!shouldRenderOutline.value || !context?.value) return undefined
  return renderOutline(context.value) ?? undefined
})

const { style, ...events } = useMapObject(toRef(props, 'styles'))
</script>
