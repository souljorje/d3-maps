<template>
  <path
    :d="path"
    data-d3m="graticule"
    fill="none"
  />
</template>

<script setup lang="ts">
import type { MapGraticuleProps } from '@d3-maps/core'

import { renderGraticule } from '@d3-maps/core'
import { computed } from 'vue'

import { useMapContext } from '../hooks/useMapContext'

const props = defineProps<MapGraticuleProps>()
const context = useMapContext()

const path = computed(() => {
  return renderGraticule(context.value, props.config) ?? undefined
})
</script>
