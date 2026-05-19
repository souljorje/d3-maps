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
          <MapObjects fill="var(--vp-c-neutral-inverse)">
            <template #default="{ objects: renderedFeatures }">
              <MapObject
                v-for="feature in renderedFeatures"
                :key="feature.key"
                :d="feature.d"
                :data-feature-key="feature.key"
                :aria-label="feature.type === 'Feature' ? getFeatureLabel(feature) : undefined"
                :styles="{
                  focus: {
                    fill: 'lightskyblue',
                  },
                }"
                class="cursor-pointer"
                role="button"
                tabindex="0"
                @click="feature.type === 'Feature' && zoomToFeature(feature)"
                @keydown.enter.space.prevent="feature.type === 'Feature' && zoomToFeature(feature)"
              />
            </template>
          </MapObjects>
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
  MapDataSource,
} from '@d3-maps/vue'

import {
  getObjectZoomView,
  useCreateMapContext,
} from '@d3-maps/vue'
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
const data = ref<MapDataSource>()
const center = ref<[number, number]>()
const zoom = ref(initialZoom)
const activeCountryLabel = ref('World')
const mapRoot = ref<HTMLElement | null>(null)

const mapContext = useCreateMapContext(computed(() => {
  return {
    data: data.value,
  }
}))

type RenderedMapObject = NonNullable<typeof mapContext.value>['objects'][number]
type MapGeoFeature = Extract<RenderedMapObject, { type: 'Feature' }>

onMounted(async () => {
  const { default: mapData } = await import('@d3-maps/atlas/world/countries')
  data.value = mapData
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

  const features = mapContext.value.objects.filter((object): object is MapGeoFeature => object.type === 'Feature')
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

function getFeatureLabel(feature: MapGeoFeature) {
  return feature.properties?.name ?? 'Country'
}
</script>
