<template>
  <g name="objects">
    <slot :objects="objects">
      <MapObject
        v-for="{ key, d } in objects"
        :key="key"
        :d="d"
        :styles="styles"
        name="object"
      />
    </slot>
  </g>
</template>

<script setup lang="ts">
import type {
  MapObjectData,
  MapObjectsProps,
} from '@d3-maps/core'
import type { StyleValue } from 'vue'

import {
  makeMapObjects,
  resolveMapData,
  resolveMapDataRef,
} from '@d3-maps/core'
import { computed } from 'vue'

import { useMapContext } from '../hooks/useMapContext'
import MapObject from './MapObject.vue'

const props = defineProps<MapObjectsProps<StyleValue>>()

defineSlots<{
  default?: (props: { objects: MapObjectData[] }) => unknown
}>()

const context = useMapContext()
const objects = computed<MapObjectData[]>(() => {
  if (props.data == null && props.objectKey == null && props.dataTransformer == null && props.getKey == null) {
    return context.value.objects
  }

  const [resolvedData, resolvedObjectKey] = resolveMapDataRef(
    props,
    context.value,
  )
  if (resolvedData == null) return []

  const objectData = resolveMapData(
    resolvedData,
    resolvedObjectKey,
    props.dataTransformer,
  )

  return makeMapObjects(objectData, context.value.path, props.getKey)
})
</script>
