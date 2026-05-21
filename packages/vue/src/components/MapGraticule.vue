<template>
  <MapObject
    :d="graticulePath"
    fill="none"
    name="graticule"
    :styles="styles"
    v-bind="attrs"
  />
</template>

<script setup lang="ts">
import type { MapGraticuleProps } from '@d3-maps/core'
import type { StyleValue } from 'vue'

import { renderGraticule } from '@d3-maps/core'
import {
  computed,
  useAttrs,
} from 'vue'

import { useMapContext } from '../hooks/useMapContext'
import MapObject from './MapObject.vue'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<MapGraticuleProps<StyleValue>>()
const context = useMapContext()
const attrs = useAttrs()

const graticulePath = computed(() => {
  return renderGraticule(context.value, props.config) ?? undefined
})
</script>
