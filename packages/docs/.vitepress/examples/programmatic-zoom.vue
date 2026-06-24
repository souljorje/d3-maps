<template>
  <div ref="mapRoot" class="grid gap-3">
    <div class="relative aspect-2/1">
      <MapBase>
        <MapZoom
          ref="zoomRef"
          :max-zoom="maxZoom"
          :transition="zoomTransition"
          :config="dragOnlyZoomConfig"
          @zoom="onZoom"
        >
          <MapSphere
            fill="var(--vp-c-bg-alt)"
            stroke="var(--vp-c-border)"
          >
            <MapGraticule pointer-events="none" />
            <MapFeatures
              :data="mapData"
              fill="var(--vp-c-neutral-inverse)"
              @update:features="renderedFeatures = $event"
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
              :data="mapData"
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
          @click="reset"
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
import type { MapFeatureRendered, MapZoomRef, ZoomEvent } from '@d3-maps/vue'

import { useMapZoom } from '@d3-maps/vue'
import { shallowRef, useTemplateRef } from 'vue'

const { default: mapData } = await import('@d3-maps/atlas/world/countries/countries-110m')

const renderedFeatures = shallowRef<MapFeatureRendered[]>([])
const mapRoot = useTemplateRef<HTMLElement>('mapRoot')

const maxZoom = 16
const zoomStep = 0.5
const zoomLevel = shallowRef(1)
const zoomTransition = { duration: 600 }
const dragOnlyZoomConfig = { filter: (event: Event) => event.type !== 'wheel' && event.type !== 'dblclick' }
// also valid: const zoom = useMapZoom('zoomRef')
const zoom = useMapZoom(useTemplateRef<MapZoomRef>('zoomRef'))

function onZoom(event: ZoomEvent) {
  zoomLevel.value = event.transform.k
}

function zoomIn() {
  zoom.scaleWith(zoomStep, { duration: 100 })
}

function zoomOut() {
  zoom.scaleWith(-zoomStep, { duration: 100 })
}

function zoomToRandomCountry() {
  const feature = renderedFeatures.value[Math.floor(Math.random() * renderedFeatures.value.length)]
  if (!feature) return

  zoomToFeature(feature)
  focusFeatureByKey(feature.key)
}

const defaultCountryLabel = 'World'
const activeCountryLabel = shallowRef(defaultCountryLabel)

function getFeatureLabel(feature: MapFeatureRendered) {
  return String(feature.properties.name ?? 'Country')
}

function zoomToFeature(feature: MapFeatureRendered) {
  const didFit = zoom.zoomToFeature(feature, 10)
  if (!didFit) return

  activeCountryLabel.value = getFeatureLabel(feature)
}

function reset() {
  zoom.reset()
  activeCountryLabel.value = defaultCountryLabel
}

function focusFeatureByKey(featureKey: string | number) {
  const featureElement = mapRoot.value?.querySelector<SVGPathElement>(`[data-feature-key="${String(featureKey)}"]`)

  featureElement?.focus({ preventScroll: true })
}
</script>
