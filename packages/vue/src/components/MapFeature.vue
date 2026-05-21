<template>
  <MapElement
    :d="d"
    :styles="styles"
    name="feature"
  />
</template>

<script setup lang="ts">
import type { MapFeatureProps } from '@d3-maps/core'
import type { StyleValue } from 'vue'

import MapElement from './MapElement.vue'

defineProps<MapFeatureProps<StyleValue>>()
</script>
