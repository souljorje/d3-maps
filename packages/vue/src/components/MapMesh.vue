<template>
  <MapObject
    :d="path"
    fill="none"
    name="mesh"
    :styles="styles"
  />
</template>

<script setup lang="ts">
import type { MapObjectProps } from '@d3-maps/core'
import type { StyleValue } from 'vue'

import { computed } from 'vue'

import { useMapContext } from '../hooks/useMapContext'
import MapObject from './MapObject.vue'

defineProps<MapObjectProps<StyleValue>>()
const context = useMapContext()

const path = computed<string | undefined>(() => context.value.renderMesh() ?? undefined)
</script>
