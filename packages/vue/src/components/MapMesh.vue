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
  MapObject,
} from '@d3-maps/core'
import type { StyleValue } from 'vue'

import {
  computed,
  toRef,
} from 'vue'

import { useMapContext } from '../hooks/useMapContext'
import { useMapObject } from '../hooks/useMapObject'

interface Props extends MapObject<StyleValue> {}

const props = defineProps<Props>()
const context = useMapContext()

const path = computed<string | undefined>(() => context.value.renderMesh() ?? undefined)

const { style, ...events } = useMapObject(toRef(props, 'styles'))
</script>
