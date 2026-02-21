<template>
  <g>
    <slot :features="features">
      <MapFeature
        v-for="(feature, index) in features"
        :key="getFeatureKey(feature, idKey, index)"
        :data="feature"
        :fill="fill"
        :stroke="stroke"
        :styles="styles"
        v-bind="$attrs"
      />
    </slot>
  </g>
</template>

<script setup lang="ts">
import type { MapObjectStyles } from '@d3-maps/core'
import type { StyleValue } from 'vue'

import { getFeatureKey } from '@d3-maps/core'
import { computed } from 'vue'

import { useMapContext } from './MapContext'
import MapFeature from './MapFeature.vue'

interface Props {
  idKey?: string
  fill?: string
  stroke?: string
  styles?: MapObjectStyles<StyleValue>
}

withDefaults(defineProps<Props>(), {
  idKey: 'id',
})

const context = useMapContext()
const features = computed(() => (context?.features ?? []))
</script>
