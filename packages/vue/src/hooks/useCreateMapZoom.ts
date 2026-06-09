import type {
  ZoomCommands,
  ZoomEvent,
  ZoomProps,
} from '@d3-maps/core'
import type {
  ComputedRef,
  InjectionKey,
  Ref,
} from 'vue'

import {
  applyZoomEventTransform,
  createZoomBehavior,
  createZoomCommands,
  setupZoom,
} from '@d3-maps/core'
import {
  computed,
  onMounted,
  onUnmounted,
  provide,
  watch,
} from 'vue'

import { useMapContext } from './useMapContext'

export const mapZoomKey: InjectionKey<boolean> = Symbol('MapZoom')

export interface MapZoomEventCallbacks {
  onZoomStart?: (event: ZoomEvent) => void
  onZoom?: (event: ZoomEvent) => void
  onZoomEnd?: (event: ZoomEvent) => void
}

export interface ResolvedZoomProps extends ZoomProps {
  minZoom: number
  maxZoom: number
}

export interface CreateMapZoomResult {
  commands: ZoomCommands
  zoomBehavior: ComputedRef<ReturnType<typeof createZoomBehavior>>
}

export function useCreateMapZoom(
  container: Ref<SVGGElement | null>,
  props: Readonly<ResolvedZoomProps>,
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
        applyZoomEventTransform(container.value, event)
        eventCallbacks.onZoom?.(event)
      },
      onZoomEnd: (event) => eventCallbacks.onZoomEnd?.(event),
    })
  })

  const commands = createZoomCommands({
    element: () => container.value,
    behavior: () => zoomBehavior.value,
    context: () => context.value,
    minZoom: () => props.minZoom,
    maxZoom: () => props.maxZoom,
    transition: () => props.transition,
  })

  provide(mapZoomKey, true)

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
    commands,
    zoomBehavior,
  }
}
