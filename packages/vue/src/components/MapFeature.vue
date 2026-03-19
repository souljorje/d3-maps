<template>
  <path
    :d="path"
    :style="style"
    v-bind="events"
    name="feature"
  />
</template>

<script setup lang="ts">
import type { MapFeatureProps as CoreMapFeatureProps } from '@d3-maps/core'
import type { StyleValue } from 'vue'

import {
  computed,
  toRef,
} from 'vue'

import { useMapContext } from '../hooks/useMapContext'
import { useMapObject } from '../hooks/useMapObject'

type MapFeatureProps = CoreMapFeatureProps<StyleValue>

const props = defineProps<MapFeatureProps>()

const { style, ...events } = useMapObject(toRef(props, 'styles'))

const context = useMapContext()

const path = computed(() => context?.value.path(props.data) ?? undefined)
</script>
