<template>
  <MapElement
    v-if="transform"
    tag="g"
    :transform="transform"
    :name="name"
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

interface Props extends MapMarkerProps<StyleValue> {
  name?: string
}

const props = withDefaults(defineProps<Props>(), { name: 'marker' })

const context = useMapContext()

const transform = computed(() => {
  return getMarkerTransform(context.value, props.coordinates)
})
</script>
