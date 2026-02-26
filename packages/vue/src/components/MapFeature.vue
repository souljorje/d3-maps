<template>
  <path
    :d="path"
    :style="style"
    v-bind="events"
    name="feature"
  />
</template>

<script setup lang="ts">
import type { MapFeatureProps } from '@d3-maps/core'
import type { StyleValue } from 'vue'

import { computed, toRef } from 'vue'

import { useMapContext } from '../hooks/useMapContext'
import { useMapObject } from '../hooks/useMapObject'

const props = defineProps<MapFeatureProps<StyleValue>>()

const { style, ...events } = useMapObject(toRef(props, 'styles'))

const context = useMapContext()

const path = computed(() => context?.value.path(props.data) ?? undefined)
</script>
