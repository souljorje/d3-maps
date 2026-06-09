<template>
  <div ref="mapRoot" class="grid gap-3">
    <div class="relative aspect-2/1">
      <MapBase :context="mapContext">
        <MapZoom
          ref="zoom"
          :min-zoom="minZoom"
          :max-zoom="maxZoom"
          :transition="zoomTransition"
          :config="zoomConfig"
          @zoom="onZoom"
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
                :styles="featureInteractionStyles"
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
          {{ zoomLevel.toFixed(1) }}x
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
  MapData,
  MapFeatureData,
  MapZoomRef,
  ZoomEvent,
} from '@d3-maps/vue'

import {
  getFeatureKey,
  useCreateMapContext,
  useMapZoom,
} from '@d3-maps/vue'
import {
  shallowRef,
  useTemplateRef,
} from 'vue'

const initialZoom = 1
const minZoom = 1
const maxZoom = 16
const zoomStep = 0.5

const { default: mapData } = await import('world-atlas/countries-110m.json')
const data = mapData as MapData
const mapContext = useCreateMapContext({ data })

const zoomLevel = shallowRef(initialZoom)
const activeCountryLabel = shallowRef('World')
const mapRoot = useTemplateRef<HTMLElement>('mapRoot')
const zoomRef = useTemplateRef<MapZoomRef>('zoom')
const zoom = useMapZoom(zoomRef)

const zoomTransition = { duration: 600 }
const zoomConfig = { filter: isDragOnlyFilter }
const featureInteractionStyles = {
  focus: {
    fill: 'lightskyblue',
  },
}

function zoomIn() {
  zoom.scaleWith(zoomStep, undefined, false)
}

function zoomOut() {
  zoom.scaleWith(-zoomStep, undefined, false)
}

function resetView() {
  zoom.reset()
  activeCountryLabel.value = 'World'
}

function zoomToRandomCountry() {
  if (!mapContext.value) return

  const randomIndex = Math.floor(Math.random() * mapContext.value.features.length)
  const feature = mapContext.value.features[randomIndex]
  if (!feature) return

  zoomToFeature(feature)
  focusFeatureByKey(getFeatureKey(feature))
}

function zoomToFeature(feature: MapFeatureData) {
  const didFit = zoom.zoomToFeature(feature)
  if (!didFit) return

  activeCountryLabel.value = getFeatureLabel(feature)
}

function onZoom(event: ZoomEvent) {
  zoomLevel.value = event.transform.k
}

function isDragOnlyFilter(event: Event) {
  return event.type !== 'wheel' && event.type !== 'dblclick'
}

function getFeatureLabel(feature: MapFeatureData) {
  return feature.properties?.name ?? 'Country'
}

function focusFeatureByKey(featureKey: string | number | undefined) {
  if (featureKey === undefined) return

  const featureElement = mapRoot.value?.querySelector<SVGPathElement>(
    `[data-feature-key="${String(featureKey)}"]`,
  )
  featureElement?.focus({ preventScroll: true })
}
</script>
