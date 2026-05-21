<template>
  <path
    :d="path"
    fill="none"
    name="mesh"
  />
</template>

<script setup lang="ts">
import type { MapMeshProps } from '@d3-maps/core'

import { renderMesh } from '@d3-maps/core'
import { computed } from 'vue'

import { useMapContext } from '../hooks/useMapContext'

const props = defineProps<MapMeshProps>()
const context = useMapContext()

const path = computed<string | undefined>(
  () => renderMesh(context.value, props.data, props.objectKey) ?? undefined,
)
</script>
