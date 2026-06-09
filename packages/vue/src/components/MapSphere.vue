<template>
  <g data-d3m="sphere">
    <defs v-if="!noClip">
      <clipPath :id="clipPathId">
        <path :d="path" />
      </clipPath>
    </defs>
    <path
      :d="path"
      :fill="fill"
      data-d3m="sphere-background"
      pointer-events="none"
      stroke="none"
    />
    <g
      :clip-path="noClip ? undefined : `url(#${clipPathId})`"
      data-d3m="sphere-content"
    >
      <slot />
    </g>
    <path
      :d="path"
      :stroke="stroke"
      data-d3m="sphere-border"
      fill="none"
      pointer-events="none"
    />
  </g>
</template>

<script setup lang="ts">
import type { MapSphereProps } from '@d3-maps/core'

import { renderSphere } from '@d3-maps/core'
import {
  computed,
  useId,
} from 'vue'

import { useMapContext } from '../hooks/useMapContext'

withDefaults(
  defineProps<MapSphereProps>(),
  {
    fill: 'none',
    noClip: false,
    stroke: 'none',
  },
)
const context = useMapContext()
const clipPathId = `d3m-sphere-${useId()}`

const path = computed(() => {
  return renderSphere(context.value) ?? undefined
})
</script>
