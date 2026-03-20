<template>
  <svg
    :viewBox="`0 0 ${context.width} ${context.height}`"
    v-bind="$attrs"
    class="d3-map"
  >
    <slot v-bind="context" />
  </svg>
</template>

<script setup lang="ts">
import type {
  MapContext,
  MapProps,
} from '@d3-maps/core'

import {
  computed,
  provide,
  toRef,
} from 'vue'

import { useCreateMapContext } from '../hooks/useCreateMapContext'
import { mapContextKey } from '../hooks/useMapContext'

type MapConfigProps = MapProps & {
  context?: undefined
}
type MapContextProps = Partial<MapProps> & {
  context: MapContext
}
type Props = MapConfigProps | MapContextProps

const props = defineProps<Props>()

defineSlots<{
  default?: (props: MapContext) => unknown
}>()

const unresolvedContext = useCreateMapContext(props, toRef(props, 'context'))
const context = computed(() => {
  if (!unresolvedContext.value) {
    throw new Error('Map requires data or context')
  }

  return unresolvedContext.value
})

provide(mapContextKey, context)
</script>
