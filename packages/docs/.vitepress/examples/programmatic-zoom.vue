<template>
  <div class="relative aspect-2/1">
    <Map
      v-if="data"
      :data="data"
      :aspect-ratio="2 / 1"
    >
      <template #default="context">
        <MapZoom
          :center="center"
          :zoom="zoom"
          :min-zoom="minZoom"
          :max-zoom="maxZoom"
          :config="{ filter: isDragOnlyFilter }"
        >
          <MapGraticule
            border
            pointer-events="none"
          />
          <MapFeatures fill="var(--vp-c-neutral-inverse)">
            <template #default="{ features: renderedFeatures }">
              <MapFeature
                v-for="(feature, index) in renderedFeatures"
                :key="getFeatureKey(feature, 'id', index)"
                :data="feature"
                class="cursor-pointer"
                @click="zoomToFeature(feature, context)"
              />
            </template>
          </MapFeatures>
          <MapMesh pointer-events="none" />
        </MapZoom>
      </template>
    </Map>
  </div>
  <div class="flex flex-col justify-center items-center gap-1 mt-2">
    <div class="flex gap-2 flex-wrap justify-center">
      <button
        type="button"
        class="flex items-center justify-center rounded-full w-7 h-7 border!"
        @click="zoomOut"
      >
        -
      </button>
      <div>
        {{ zoom.toFixed(1) }}x
      </div>
      <button
        type="button"
        class="flex items-center justify-center rounded-full w-7 h-7 border!"
        @click="zoomIn"
      >
        +
      </button>
      <button
        type="button"
        class="flex rounded border! px-3! h-7"
        :disabled="!features.length"
        @click="zoomToRandomCountry"
      >
        Random
      </button>
      <button
        type="button"
        class="flex rounded border! px-3! h-7"
        @click="resetView"
      >
        Reset
      </button>
    </div>
    <div class="text-sm text-(--vp-c-text-2)">
      Click any country to zoom to it. Drag enabled, wheel zoom disabled.
    </div>
    <div class="text-sm text-(--vp-c-text-2)">
      Focus: {{ activeCountryLabel }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  MapContext,
  MapData,
  MapFeature,
} from '@d3-maps/core'

import {
  getFeatureKey,
  makeMapContext,
} from '@d3-maps/core'
import { withBase } from 'vitepress'
import {
  computed,
  onMounted,
  ref,
} from 'vue'

const initialZoom = 1
const minZoom = 1
const maxZoom = 8
const zoomStep = 0.5

const data = ref<MapData>()
const center = ref<[number, number]>()
const zoom = ref(initialZoom)
const activeCountryLabel = ref('World')

const mapContext = computed(() => {
  return data.value
    ? makeMapContext({
        data: data.value,
      })
    : undefined
})

const features = computed(() => mapContext.value?.features ?? [])

onMounted(async () => {
  const response = await fetch(withBase('/example-data/countries-110m.json'))
  data.value = await response.json()
})

function zoomIn() {
  setZoom(zoom.value + zoomStep)
}

function zoomOut() {
  setZoom(zoom.value - zoomStep)
}

function resetView() {
  center.value = undefined
  setZoom(initialZoom)
  activeCountryLabel.value = 'World'
}

function setZoom(nextZoom: number) {
  zoom.value = clampZoom(nextZoom)
}

function zoomToRandomCountry() {
  if (!features.value.length || !mapContext.value) return

  const randomIndex = Math.floor(Math.random() * features.value.length)
  const feature = features.value[randomIndex]

  if (!feature) return

  zoomToFeature(
    feature,
    mapContext.value,
  )
}

function zoomToFeature(
  feature: MapFeature,
  context: MapContext,
) {
  const { path, width, height } = context
  const [[x0, y0], [x1, y1]] = path.bounds(feature)
  const boundsWidth = x1 - x0
  const boundsHeight = y1 - y0

  if (!Number.isFinite(boundsWidth) || !Number.isFinite(boundsHeight) || boundsWidth <= 0 || boundsHeight <= 0) {
    return
  }

  const fittedZoom = clampZoom(0.9 / Math.max(boundsWidth / width, boundsHeight / height))
  zoom.value = fittedZoom
  center.value = [
    (x0 + x1) / 2,
    (y0 + y1) / 2,
  ]
  activeCountryLabel.value = getFeatureLabel(feature)
}

function isDragOnlyFilter(event: Event) {
  return event.type !== 'wheel' && event.type !== 'dblclick'
}

function clampZoom(value: number) {
  return Math.min(maxZoom, Math.max(minZoom, value))
}

function getFeatureLabel(feature: MapFeature) {
  return feature.properties?.name ?? 'Country'
}
</script>
