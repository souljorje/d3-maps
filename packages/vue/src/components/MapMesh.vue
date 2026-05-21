<template>
  <MapObject
    :d="path"
    fill="none"
    name="mesh"
    :styles="styles"
  />
</template>

<script setup lang="ts">
import type { MapMeshProps } from '@d3-maps/core'
import type { StyleValue } from 'vue'

import { renderMesh } from '@d3-maps/core'
import { computed } from 'vue'

import { useMapContext } from '../hooks/useMapContext'
import MapObject from './MapObject.vue'

const props = defineProps<MapMeshProps<StyleValue>>()
const context = useMapContext()

const path = computed<string | undefined>(
  () => renderMesh(context.value, props.data, props.objectKey) ?? undefined,
)
</script>
