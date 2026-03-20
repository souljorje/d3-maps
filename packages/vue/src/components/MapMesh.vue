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
import type { MapObjectProps } from '@d3-maps/core'
import type { StyleValue } from 'vue'

import {
  computed,
  toRef,
} from 'vue'

import { useMapContext } from '../hooks/useMapContext'
import { useMapObject } from '../hooks/useMapObject'

const props = defineProps<MapObjectProps<StyleValue>>()
const context = useMapContext()

const path = computed<string | undefined>(() => context?.value.renderMesh() ?? undefined)

const { style, ...events } = useMapObject(toRef(props, 'styles'))
</script>
