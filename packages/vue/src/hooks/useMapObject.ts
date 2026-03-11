import type {
  MapObjectInteractionController,
  MapObjectState,
} from '@d3-maps/core'
import type {
  ComputedRef,
  MaybeRef,
  StyleValue,
} from 'vue'

import {
  resolveObjectStyle,
  useMapObjectEvents,
} from '@d3-maps/core'
import {
  computed,
  onBeforeUnmount,
  ref,
  unref,
} from 'vue'

import { useInsideZoom } from './useInsideZoom'

export interface UseMapObjectResult {
  style: ComputedRef<StyleValue | undefined>
  onMouseenter: (event: MouseEvent) => void
  onMouseleave: (event: MouseEvent) => void
  onMousedown: (event: MouseEvent) => void
  onMouseup: (event: MouseEvent) => void
}

export function useMapObject(
  styles: MaybeRef<Partial<Record<MapObjectState, StyleValue>> | undefined>,
): UseMapObjectResult {
  const state = ref<MapObjectState>('default')
  const insideZoom = useInsideZoom()

  const {
    onMouseenter,
    onMouseleave,
    onMouseup,
    onMousedown,
    dispose,
  }: MapObjectInteractionController<MouseEvent> = useMapObjectEvents((nextState) => {
    state.value = nextState
  }, insideZoom)

  onBeforeUnmount(() => {
    dispose()
  })

  const style = computed(() => resolveObjectStyle(state.value, unref(styles)))

  return {
    style,
    onMouseenter,
    onMouseleave,
    onMousedown,
    onMouseup,
  }
}
