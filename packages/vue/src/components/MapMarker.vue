<template>
  <g
    v-if="transform"
    :transform="transform"
    :style="style"
    :name="props.name"
    v-on="events"
  >
    <slot />
  </g>
</template>

<script setup lang="ts">
import type { StyleValue } from 'vue'

import { getMarkerTransform } from '@d3-maps/core'
import {
  computed,
  toRef,
} from 'vue'

import { useMapContext } from '../hooks/useMapContext'
import { useMapObject } from '../hooks/useMapObject'

interface Props {
  coordinates: [number, number]
  styles?: Partial<Record<'default' | 'hover' | 'active', StyleValue>>
  name?: string
}

const props = withDefaults(defineProps<Props>(), {
  name: 'marker',
})

const context = useMapContext()

const transform = computed(() => {
  return getMarkerTransform(context?.value, props.coordinates)
})

const { style, ...events } = useMapObject(toRef(props, 'styles'))
</script>
