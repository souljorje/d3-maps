<template>
  <div
    v-if="mapContext"
    ref="mapRoot"
    class="grid gap-3"
  >
    <div class="relative aspect-2/1">
      <MapBase
        :context="mapContext"
      >
        <MapZoom
          :center="center"
          :zoom="zoom"
          :min-zoom="minZoom"
          :max-zoom="maxZoom"
          :transition="{ duration: isTransitionOn ? 600 : 0 }"
          :config="{ filter: isDragOnlyFilter }"
        >
          <MapGraticule
            border
            pointer-events="none"
          />
          <MapFeatures fill="var(--vp-c-neutral-inverse)">
            <template #default="{ features: renderedFeatures }">
              <MapFeature
                v-for="(feature) in renderedFeatures"
                :key="getFeatureKey(feature)"
                :data="feature"
                :data-feature-key="getFeatureKey(feature)"
                :aria-label="getFeatureLabel(feature)"
                :styles="{
                  focus: {
                    fill: 'lightskyblue',
                  },
                }"
                class="cursor-pointer"
                role="button"
                tabindex="0"
                @click="zoomToFeature(feature)"
                @keydown.enter.space.prevent="zoomToFeature(feature)"
              />
            </template>
          </MapFeatures>
          <MapMesh pointer-events="none" />
        </MapZoom>
      </MapBase>
    </div>
    <div class="flex flex-col justify-center items-center gap-2">
      <div>
        Focus: {{ activeCountryLabel }}
      </div>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  MapFeature as D3MapFeature,
  MapData,
} from '@d3-maps/core'

import {
  getFeatureKey,
  getObjectZoomView,
} from '@d3-maps/core'
import { useCreateMapContext } from '@d3-maps/vue'
import { withBase } from 'vitepress'
import {
  computed,
  nextTick,
  onMounted,
  ref,
} from 'vue'

const initialZoom = 1
const minZoom = 1
const maxZoom = 16
const zoomStep = 0.5
const data = ref<MapData>()
const center = ref<[number, number]>()
const zoom = ref(initialZoom)
const activeCountryLabel = ref('World')
const mapRoot = ref<HTMLElement | null>(null)

const mapContext = useCreateMapContext(computed(() => {
  return {
    data: data.value,
  }
}))

onMounted(async () => {
  const response = await fetch(withBase('/example-data/countries-110m.json'))
  data.value = await response.json()
})

const isTransitionOn = ref(true)

async function zoomIn() {
  isTransitionOn.value = false
  setZoom(zoom.value + zoomStep)
  await nextTick()
  isTransitionOn.value = true
}

async function zoomOut() {
  isTransitionOn.value = false
  setZoom(zoom.value - zoomStep)
  await nextTick()
  isTransitionOn.value = true
}

function resetView() {
  center.value = undefined
  setZoom(initialZoom)
  activeCountryLabel.value = 'World'
}

function setZoom(nextZoom: number) {
  zoom.value = clampZoom(nextZoom)
}

async function zoomToRandomCountry() {
  if (!mapContext.value) return

  const randomIndex = Math.floor(Math.random() * mapContext.value.features.length)
  const feature = mapContext.value.features[randomIndex]

  const featureElement = mapRoot.value?.querySelector<SVGPathElement>(
    `[data-feature-key="${getFeatureKey(feature)}"]`,
  )
  if (featureElement) {
    zoomToFeature(feature)
    featureElement.focus({ preventScroll: true })
  }
}

function zoomToFeature(feature: D3MapFeature) {
  if (!mapContext.value) return

  const view = getObjectZoomView(mapContext.value, feature, {
    minZoom,
    maxZoom,
  })

  if (!view) return

  zoom.value = view.zoom
  center.value = view.center
  activeCountryLabel.value = getFeatureLabel(feature)
}

function isDragOnlyFilter(event: Event) {
  return event.type !== 'wheel' && event.type !== 'dblclick'
}

function clampZoom(value: number) {
  return Math.min(maxZoom, Math.max(minZoom, value))
}

function getFeatureLabel(feature: D3MapFeature) {
  return feature.properties?.name ?? 'Country'
}
</script>
