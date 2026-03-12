<template>
  <path
    :d="path"
    fill="none"
    :style="style"
    v-bind="events"
    name="line"
  />
</template>

<script setup lang="ts">
import type { MapLineProps } from '@d3-maps/core'
import type { StyleValue } from 'vue'

import { getLinePath } from '@d3-maps/core'
import {
  computed,
  toRef,
} from 'vue'

import { useMapContext } from '../hooks/useMapContext'
import { useMapObject } from '../hooks/useMapObject'

const props = withDefaults(defineProps<MapLineProps<StyleValue>>(), {
  coordinates: () => [],
  curve: false,
})

const context = useMapContext()

const path = computed<string | undefined>(() => {
  return getLinePath(context?.value, props.coordinates, props.curve)
})

const { style, ...events } = useMapObject(toRef(props, 'styles'))
</script>
