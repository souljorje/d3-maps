import type {
  ObjectZoomView,
  ZoomEvent,
  ZoomObject,
  ZoomProps,
} from '@d3-maps/core'
import type {
  ComputedRef,
  InjectionKey,
  Ref,
} from 'vue'

import {
  applyZoom,
  applyZoomGroupTransform,
  createZoomBehavior,
  getObjectZoomView,
  setupZoom,
} from '@d3-maps/core'
import {
  computed,
  inject,
  onMounted,
  onUnmounted,
  provide,
  watch,
} from 'vue'

import {
  mapContextKey,
  useMapContext,
} from './useMapContext'

export type ZoomToObjectCallback = (view: ObjectZoomView) => void

export interface UseMapZoomResult {
  center: ComputedRef<[number, number] | undefined>
  zoom: ComputedRef<number>
  minZoom: ComputedRef<number>
  maxZoom: ComputedRef<number>
  zoomToObject: (
    object: ZoomObject,
    callback: ZoomToObjectCallback,
  ) => void
}

export const mapZoomKey: InjectionKey<UseMapZoomResult> = Symbol('MapZoom')

export interface MapZoomEventCallbacks {
  onZoomStart?: (event: ZoomEvent) => void
  onZoom?: (event: ZoomEvent) => void
  onZoomEnd?: (event: ZoomEvent) => void
}

export interface ZoomPropsWithDefaults extends ZoomProps {
  zoom: number
  minZoom: number
  maxZoom: number
}

export interface CreateMapZoomResult {
  zoomBehavior: ComputedRef<ReturnType<typeof createZoomBehavior>>
  zoomContext: UseMapZoomResult
}

export function useCreateMapZoom(
  container: Ref<SVGGElement | null>,
  props: Readonly<ZoomPropsWithDefaults>,
  eventCallbacks: MapZoomEventCallbacks,
): CreateMapZoomResult {
  const context = useMapContext()

  const zoomBehavior = computed(() => {
    return createZoomBehavior(context.value, {
      minZoom: props.minZoom,
      maxZoom: props.maxZoom,
      config: props.config,
      onZoomStart: (event) => eventCallbacks.onZoomStart?.(event),
      onZoom: (event) => {
        applyZoomGroupTransform(container.value, event.transform)
        eventCallbacks.onZoom?.(event)
      },
      onZoomEnd: (event) => eventCallbacks.onZoomEnd?.(event),
    })
  })

  const zoomContext: UseMapZoomResult = {
    center: computed(() => props.center),
    zoom: computed(() => props.zoom),
    minZoom: computed(() => props.minZoom),
    maxZoom: computed(() => props.maxZoom),
    zoomToObject: (object, callback) => {
      const view = getObjectZoomView(context.value, object, {
        minZoom: props.minZoom,
        maxZoom: props.maxZoom,
      })

      if (!view) return

      callback(view)
    },
  }

  provide<UseMapZoomResult>(mapZoomKey, zoomContext)

  let stopBehaviorWatch: (() => void) | undefined
  let stopViewWatch: (() => void) | undefined
  onMounted(() => {
    stopBehaviorWatch = watch(zoomBehavior, (behavior) => {
      if (!container.value) return
      setupZoom({
        element: container.value,
        behavior,
        center: props.center,
        zoom: props.zoom,
        transition: props.transition,
      })
    }, { immediate: true })

    stopViewWatch = watch([
      () => props.center,
      () => props.zoom,
      () => props.transition,
    ], () => {
      if (!container.value) return
      applyZoom({
        element: container.value,
        behavior: zoomBehavior.value,
        center: props.center,
        zoom: props.zoom,
        transition: props.transition,
      })
    })
  })

  onUnmounted(() => {
    stopBehaviorWatch?.()
    stopViewWatch?.()
  })

  return {
    zoomBehavior,
    zoomContext,
  }
}

export function useMapZoom(): UseMapZoomResult | undefined {
  const zoomContext = inject(mapZoomKey, undefined)
  const mapContext = inject(mapContextKey, undefined)

  if (!zoomContext) return undefined

  return {
    ...zoomContext,
    zoomToObject: (object, callback) => {
      if (!mapContext?.value) return

      const view = getObjectZoomView(mapContext.value, object, {
        minZoom: zoomContext.minZoom.value,
        maxZoom: zoomContext.maxZoom.value,
      })

      if (!view) return

      callback(view)
    },
  }
}
