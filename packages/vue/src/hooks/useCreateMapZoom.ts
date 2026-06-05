import type {
  ApplyZoomTransformOptions,
  ScaleToOptions,
  ZoomEvent,
  ZoomFitOptions,
  ZoomObject,
  ZoomProps,
  ZoomTransform,
} from '@d3-maps/core'
import type {
  ComputedRef,
  InjectionKey,
  Ref,
} from 'vue'

import {
  scaleTo as applyScaleTo,
  applyZoomEventTransform,
  applyZoomTransform,
  createZoomBehavior,
  getCurrentZoomTransform,
  getFeatureZoomTransform,
  setupZoom,
  zoomIdentity,
} from '@d3-maps/core'
import {
  computed,
  onMounted,
  onUnmounted,
  provide,
  watch,
} from 'vue'

import { useMapContext } from './useMapContext'

export interface MapZoomProps extends ZoomProps {}

export interface UseMapZoomResult {
  minZoom: ComputedRef<number>
  maxZoom: ComputedRef<number>
}

export const mapZoomKey: InjectionKey<UseMapZoomResult> = Symbol('MapZoom')

export interface MapZoomEventCallbacks {
  onZoomStart?: (event: ZoomEvent) => void
  onZoom?: (event: ZoomEvent) => void
  onZoomEnd?: (event: ZoomEvent) => void
}

export interface ResolvedMapZoomProps extends MapZoomProps {
  minZoom: number
  maxZoom: number
}

export type MapZoomCommandOptions = Pick<ApplyZoomTransformOptions, 'transition'>

export interface MapZoomFeatureOptions extends ZoomFitOptions, MapZoomCommandOptions {}
export type MapZoomByOptions = Pick<ScaleToOptions, 'transition'>
export type MapZoomToScaleOptions = Pick<ScaleToOptions, 'transition'>

export interface MapZoomCommands {
  zoomTo: (transform: ZoomTransform, options?: MapZoomCommandOptions) => void
  zoomBy: (delta: number, options?: MapZoomByOptions) => void
  zoomToScale: (scale: number, options?: MapZoomToScaleOptions) => void
  zoomToFeature: (feature: ZoomObject, options?: MapZoomFeatureOptions) => boolean
  reset: (options?: MapZoomCommandOptions) => void
}

export interface CreateMapZoomResult extends MapZoomCommands {
  zoomBehavior: ComputedRef<ReturnType<typeof createZoomBehavior>>
  zoomContext: UseMapZoomResult
}

export function useCreateMapZoom(
  container: Ref<SVGGElement | null>,
  props: Readonly<ResolvedMapZoomProps>,
  eventCallbacks: MapZoomEventCallbacks,
): CreateMapZoomResult {
  const context = useMapContext()

  function handleEvent(
    callback: ((event: ZoomEvent) => void) | undefined,
    event: ZoomEvent,
  ): void {
    applyZoomEventTransform(container.value, event)
    if (!callback) return
    callback(event)
  }

  const zoomBehavior = computed(() => {
    return createZoomBehavior(context.value, {
      minZoom: props.minZoom,
      maxZoom: props.maxZoom,
      config: props.config,
      onZoomStart: (event) => {
        handleEvent(eventCallbacks.onZoomStart, event)
      },
      onZoom: (event) => {
        handleEvent(eventCallbacks.onZoom, event)
      },
      onZoomEnd: (event) => {
        handleEvent(eventCallbacks.onZoomEnd, event)
      },
    })
  })

  const zoomContext: UseMapZoomResult = {
    minZoom: computed(() => props.minZoom),
    maxZoom: computed(() => props.maxZoom),
  }

  // function callZoom(cb, opts) {
  //   return callZoomMethod({
  //     element: container.value,
  //     transition: opts?.transition ?? props.transition
  //   }, (target) => {
  //     cb()
  //   })
  // }

  function zoomTo(
    transform: ZoomTransform,
    options?: MapZoomCommandOptions,
  ): void {
    applyZoomTransform({
      element: container.value,
      behavior: zoomBehavior.value,
      transform,
      transition: options?.transition ?? props.transition,
    })
  }

  function zoomBy(
    delta: number,
    options?: MapZoomByOptions,
  ): void {
    const currentTransform = getCurrentZoomTransform(container.value)
    zoomToScale(currentTransform.k + delta, options)
  }

  function zoomToScale(
    scale: number,
    options?: MapZoomToScaleOptions,
  ): void {
    applyScaleTo({
      element: container.value,
      behavior: zoomBehavior.value,
      scale,
      transition: options?.transition ?? props.transition,
    })
  }

  function zoomToFeature(
    feature: ZoomObject,
    options: MapZoomFeatureOptions = {},
  ): boolean {
    const transform = getFeatureZoomTransform(context.value, feature, {
      minZoom: options.minZoom ?? props.minZoom,
      maxZoom: options.maxZoom ?? props.maxZoom,
      padding: options.padding,
    })
    if (!transform) return false
    zoomTo(transform, options)
    return true
  }

  function reset(options?: MapZoomCommandOptions): void {
    zoomTo(zoomIdentity, options)
  }

  provide<UseMapZoomResult>(mapZoomKey, zoomContext)

  let stopBehaviorWatch: (() => void) | undefined
  onMounted(() => {
    stopBehaviorWatch = watch(zoomBehavior, (behavior) => {
      if (!container.value) return
      setupZoom({
        element: container.value,
        behavior,
      })
    }, { immediate: true })
  })

  onUnmounted(() => {
    stopBehaviorWatch?.()
  })

  return {
    reset,
    zoomBy,
    zoomTo,
    zoomToFeature,
    zoomToScale,
    zoomBehavior,
    zoomContext,
  }
}
