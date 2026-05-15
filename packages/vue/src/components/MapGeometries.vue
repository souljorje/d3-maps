<template>
  <g name="geometries">
    <slot :geometries="geometries">
      <MapObject
        v-for="{ key, d } in geometries"
        :key="key"
        :d="d"
        :styles="styles"
        name="geometry"
      />
    </slot>
  </g>
</template>

<script setup lang="ts">
import type { MapGeometriesProps, RenderedGeometry } from '@d3-maps/core'
import type { StyleValue } from 'vue'

import { computed } from 'vue'

import { useMapContext } from '../hooks/useMapContext'
import MapObject from './MapObject.vue'

defineProps<MapGeometriesProps<StyleValue>>()

const context = useMapContext()
const geometries = computed<RenderedGeometry[]>(() => context.value.geometries)
</script>
