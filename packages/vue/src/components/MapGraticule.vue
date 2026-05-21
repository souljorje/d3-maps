<template>
  <path
    :d="graticulePath"
    fill="none"
    name="graticule"
    v-bind="attrs"
  />
</template>

<script setup lang="ts">
import type { MapGraticuleProps } from '@d3-maps/core'

import { renderGraticule } from '@d3-maps/core'
import {
  computed,
  useAttrs,
} from 'vue'

import { useMapContext } from '../hooks/useMapContext'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<MapGraticuleProps>()
const context = useMapContext()
const attrs = useAttrs()

const graticulePath = computed(() => {
  return renderGraticule(context.value, props.config) ?? undefined
})
</script>
