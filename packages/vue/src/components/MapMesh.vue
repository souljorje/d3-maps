<template>
  <path
    v-if="path"
    :d="path"
    :style="computedStyle"
    :fill="fill"
    :stroke="stroke"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @mousedown="onMouseDown"
    @mouseup="onMouseUp"
    @click="onMouseUp"
    @focus="onFocus"
    @blur="onBlur"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import type { MapObjectStyles } from '@d3-maps/core'
import type { StyleValue } from 'vue'
import type { MapObjectEmit } from '../lib/useMapObject'
import { computed, toRef } from 'vue'
import { useMapObject } from '../lib/useMapObject'
import { useMapContext } from './MapContext'

interface Props {
  fill?: string
  stroke?: string
  styles?: MapObjectStyles<StyleValue>
}

const props = defineProps<Props>()
const emit = defineEmits<MapObjectEmit>()
const context = useMapContext()

const path = computed(() => context?.renderMesh())

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
