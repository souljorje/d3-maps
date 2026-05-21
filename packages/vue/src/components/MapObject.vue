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
import type { MapObjectProps } from '@d3-maps/core'
import type { StyleValue } from 'vue'

import { toRef } from 'vue'

import { useInteraction } from '../hooks/useInteraction'

type MapObjectPathProps = MapObjectProps<StyleValue> & {
  tag?: 'path'
}

type MapObjectGroupProps = MapObjectProps<StyleValue> & {
  tag?: 'g'
}

type Props = MapObjectPathProps | MapObjectGroupProps

const props = withDefaults(defineProps<Props>(), { tag: 'path' })

const { style, ...events } = useInteraction(toRef(props, 'styles'))
</script>
