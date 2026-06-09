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
          <MapSphere
            fill="var(--vp-c-bg-alt)"
            stroke="var(--vp-c-border)"
          >
            <MapGraticule pointer-events="none" />
            <MapFeatures
              :data="data"
              fill="var(--vp-c-neutral-inverse)"
            >
              <template #default="{ features }">
                <MapFeature
                  v-for="feature in features"
                  :key="feature.key"
                  :d="feature.d"
                  :data-feature-key="feature.key"
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
            <MapMesh
              :data="data"
              pointer-events="none"
            />
          </MapSphere>
        </MapZoom>
      </MapBase>
    </div>
    <div class="flex flex-col justify-center items-center gap-2">
      <div>
        {{ activeCountryLabel }}
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
import type { MapData, MapZoomRef, ZoomEvent } from '@d3-maps/vue'

import {
  makeMapFeatures,
} from '@d3-maps/core'
import {
  useCreateMapContext,
  useMapZoom,
} from '@d3-maps/vue'
import {
  computed,
  shallowRef,
  useTemplateRef,
} from 'vue'

const initialZoom = 1
const minZoom = 1
const maxZoom = 16
const zoomStep = 0.5

const { default: mapData } = await import('@d3-maps/atlas/world/countries/countries-110m')
const data = mapData as MapData

const zoomLevel = shallowRef(initialZoom)
const activeCountryLabel = shallowRef('World')
const mapRoot = useTemplateRef<HTMLElement>('mapRoot')
const zoomRef = useTemplateRef<MapZoomRef>('zoom')
const zoom = useMapZoom(zoomRef)
const mapContext = useCreateMapContext()

const renderedFeatures = computed(() => {
  if (!mapContext.value) return []

  return makeMapFeatures(mapContext.value, {
    data,
  })
})

type RenderedMapFeature = typeof renderedFeatures.value[number]
type MapGeoFeature = Extract<RenderedMapFeature, { type: 'Feature' }>

const zoomTransition = { duration: 600 }
const zoomConfig = { filter: isDragOnlyFilter }

function zoomIn() {
  zoom.scaleWith(zoomStep)
}

function zoomOut() {
  zoom.scaleWith(-zoomStep)
}

function resetView() {
  zoom.reset()
  activeCountryLabel.value = 'World'
}

function zoomToRandomCountry() {
  const features = renderedFeatures.value
  const randomIndex = Math.floor(Math.random() * features.length)
  const feature = features[randomIndex]

  if (!feature) return

  const featureElement = mapRoot.value?.querySelector<SVGPathElement>(
    `[data-feature-key="${feature.key}"]`,
  )
  if (featureElement) {
    zoomToFeature(feature)
    featureElement.focus({ preventScroll: true })
  }
}

function zoomToFeature(feature: MapGeoFeature) {
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

function getFeatureLabel(feature: MapGeoFeature) {
  return String(feature.properties.name ?? 'Country')
}
</script>
