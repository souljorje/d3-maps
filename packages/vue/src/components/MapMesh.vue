<template>
  <path
    v-if="path"
    :d="path"
    :style="computedStyle"
    :fill="fill"
    :stroke="stroke"
    v-bind="$attrs"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @mousedown="onMouseDown"
    @mouseup="onMouseUp"
    @click="onMouseUp"
    @focus="onFocus"
    @blur="onBlur"
  />
</template>

<script setup lang="ts">
import type {
  MapObjectEmit,
  MapObjectStyles,
} from '../hooks/useMapObject'

import { computed, toRef } from 'vue'

import { useMapContext } from '../hooks/useMapContext'
import { useMapObject } from '../hooks/useMapObject'

interface Props {
  fill?: string
  stroke?: string
  styles?: MapObjectStyles
}

const props = withDefaults(defineProps<Props>(), { fill: 'none' })
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
