<template>
  <path
    :d="path"
    :fill="fill"
    :stroke="stroke"
    data-d3m="sphere"
    pointer-events="none"
  />
</template>

<script setup lang="ts">
import type { MapSphereProps } from '@d3-maps/core'

import { renderSphere } from '@d3-maps/core'
import { computed } from 'vue'

import { useMapContext } from '../hooks/useMapContext'

withDefaults(
  defineProps<MapSphereProps>(),
  {
    fill: 'none',
    stroke: 'none',
  },
)
const context = useMapContext()

const path = computed(() => {
  return renderSphere(context.value) ?? undefined
})
</script>
