import type {
  DefaultZoomBehavior,
  ZoomBinding,
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
  createZoomBinding,
  createZoomCommandsProxy,
} from '@d3-maps/core'
import {
  computed,
  onMounted,
  onUnmounted,
  provide,
  shallowRef,
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
  zoomBehavior: ComputedRef<DefaultZoomBehavior>
}

export function useCreateMapZoom(
  container: Ref<SVGGElement | null>,
  props: Readonly<ResolvedZoomProps>,
  eventCallbacks: MapZoomEventCallbacks,
): CreateMapZoomResult {
  const context = useMapContext()
  const binding = shallowRef<ZoomBinding>()
  const zoomBehavior = computed(() => binding.value!.zoomBehavior)
  const commands = createZoomCommandsProxy(() => binding.value?.commands)

  provide(mapZoomKey, true)

  onMounted(() => {
    if (!container.value) return
    binding.value = createZoomBinding(
      () => context.value,
      container.value,
      () => ({
        minZoom: props.minZoom,
        maxZoom: props.maxZoom,
        transition: props.transition,
        config: props.config,
        onZoomStart: (event) => eventCallbacks.onZoomStart?.(event),
        onZoom: (event) => eventCallbacks.onZoom?.(event),
        onZoomEnd: (event) => eventCallbacks.onZoomEnd?.(event),
      }),
    )
  })

  watch([
    context,
    () => props.minZoom,
    () => props.maxZoom,
    () => props.config,
  ], () => binding.value?.update(), { flush: 'post' })

  onUnmounted(() => {
    binding.value?.dispose()
    binding.value = undefined
  })

  return { commands, zoomBehavior }
}
