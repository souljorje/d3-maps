<template>
  <MapElement
    v-if="transform"
    tag="g"
    data-d3m="marker"
    :transform="transform"
    :styles="styles"
  >
    <slot />
  </MapElement>
</template>

<script setup lang="ts">
import type { MapMarkerProps } from '@d3-maps/core'
import type { StyleValue } from 'vue'

import { getMarkerTransform } from '@d3-maps/core'
import { computed } from 'vue'

import { useMapContext } from '../hooks/useMapContext'
import MapElement from './MapElement.vue'

const props = defineProps<MapMarkerProps<StyleValue>>()

const context = useMapContext()

const transform = computed(() => {
  return getMarkerTransform(context.value, props.coordinates)
})
</script>
