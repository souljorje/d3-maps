<template>
  <path
    v-bind="pathAttrs"
    :d="path"
    :fill="fill"
    :style="style"
  />
</template>

<script setup lang="ts">
import type { MapLineProps } from '@d3-maps/core'
import type { StyleValue } from 'vue'

import { getLinePath } from '@d3-maps/core'
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

const props = withDefaults(defineProps<MapLineProps<StyleValue>>(), {
  cartesian: false,
  custom: false,
})

const attrs = useAttrs()

const context = useMapContext()

const path = computed<string | undefined>(() => {
  return getLinePath(
    context.value,
    {
      coordinates: props.coordinates,
      custom: props.custom,
      curve: props.curve,
      cartesian: props.cartesian,
      midpoint: props.midpoint,
    },
  )
})

const pathName = computed(() => (attrs.name as string | undefined) ?? 'line')
const fill = computed(() => (attrs.fill as string | undefined) ?? 'none')
const { style, ...events } = useMapObject(toRef(props, 'styles'))
const pathAttrs = computed(() => ({
  ...attrs,
  ...events,
  name: pathName.value,
}))
</script>
