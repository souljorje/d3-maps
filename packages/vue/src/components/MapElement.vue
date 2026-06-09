<template>
  <component
    :is="tag"
    v-bind="events"
    :style="style"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import type { MapElementProps } from '@d3-maps/core'
import type { StyleValue } from 'vue'

import { toRef } from 'vue'

import { useInteraction } from '../hooks/useInteraction'

type MapElementPathProps = MapElementProps<StyleValue> & {
  tag?: 'path'
}

type MapElementGroupProps = MapElementProps<StyleValue> & {
  tag?: 'g'
}

type Props = MapElementPathProps | MapElementGroupProps

const props = withDefaults(defineProps<Props>(), { tag: 'path' })

const { style, ...events } = useInteraction(toRef(props, 'styles'))
</script>
