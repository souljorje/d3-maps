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
import type { MapFeatureProps } from '@d3-maps/core'
import type { StyleValue } from 'vue'

import type { MapObjectEmit } from '../lib/useMapObject'

import { computed, toRef } from 'vue'

import { useMapObject } from '../lib/useMapObject'
import { useMapContext } from './MapContext'

const props = defineProps<MapFeatureProps<StyleValue>>()

const emit = defineEmits<MapObjectEmit>()

const context = useMapContext()

const path = computed(() => context?.renderPath(props.data))

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
