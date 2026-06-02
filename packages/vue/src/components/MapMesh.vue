<template>
  <path
    :d="path"
    data-d3m="mesh"
    fill="none"
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
  () => renderMesh(context.value, props.data, props.objectKey, props.filter) ?? undefined,
)
</script>
