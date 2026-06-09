<template>
  <MapElement
    :d="d"
    data-d3m="feature"
    :styles="styles"
  />
</template>

<script setup lang="ts">
import type { MapFeatureProps } from '@d3-maps/core'
import type { StyleValue } from 'vue'

import MapElement from './MapElement.vue'

defineProps<MapFeatureProps<StyleValue>>()
</script>
