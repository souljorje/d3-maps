<template>
  <path
    v-bind="pathAttrs"
    :d="path"
    fill="none"
    :style="style"
  />
</template>

<script setup lang="ts">
import type {
  MapLineCoordinates,
  MapLineCurve,
  MapObjectProps,
} from '@d3-maps/core'
import type { StyleValue } from 'vue'

import { getLinePath } from '@d3-maps/core'
import {
  computed,
  toRef,
  useAttrs,
} from 'vue'

import { useMapContext } from '../hooks/useMapContext'
import { useMapObject } from '../hooks/useMapObject'

interface Props extends MapObjectProps<StyleValue> {
  coordinates: MapLineCoordinates
  cartesian?: boolean
  custom?: boolean
  curve?: MapLineCurve
  curveOffset?: [number, number]
}

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<Props>(), {
  cartesian: false,
  custom: false,
})

const attrs = useAttrs()

const context = useMapContext()

const path = computed<string | undefined>(() => {
  return getLinePath(
    context?.value,
    {
      coordinates: props.coordinates,
      custom: props.custom,
      curve: props.curve,
      cartesian: props.cartesian,
      curveOffset: props.curveOffset,
    },
  )
})

const pathName = computed(() => (attrs.name as string | undefined) ?? 'line')
const { style, ...events } = useMapObject(toRef(props, 'styles'))
const pathAttrs = computed(() => ({
  ...attrs,
  ...events,
  name: pathName.value,
}))
</script>
