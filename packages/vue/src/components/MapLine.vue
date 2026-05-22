<template>
  <MapElement
    :d="path"
    data-d3m="line"
    fill="none"
    :styles="styles"
  />
</template>

<script setup lang="ts">
import type { MapLineProps } from '@d3-maps/core'
import type { StyleValue } from 'vue'

import { getLinePath } from '@d3-maps/core'
import { computed } from 'vue'

import { useMapContext } from '../hooks/useMapContext'
import MapElement from './MapElement.vue'

const props = withDefaults(defineProps<MapLineProps<StyleValue>>(), {
  cartesian: false,
  custom: false,
})

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
</script>
