<template>
  <path
    :d="path"
    fill="none"
    :style="style"
    v-bind="events"
    name="mesh"
  />
</template>

<script setup lang="ts">
import type {
  MapObjectStyles,
} from '../hooks/useMapObject'

import { computed, toRef } from 'vue'

import { useMapContext } from '../hooks/useMapContext'
import { useMapObject } from '../hooks/useMapObject'

interface Props {
  styles?: MapObjectStyles
}

const props = defineProps<Props>()
const context = useMapContext()

const path = computed<string | undefined>(() => context?.value.renderMesh() ?? undefined)

const { style, ...events } = useMapObject(toRef(props, 'styles'))
</script>
