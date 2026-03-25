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

import { useMapZoom } from './useMapZoom'

export interface UseMapObjectResult {
  style: ComputedRef<StyleValue | undefined>
  onMouseenter: () => void
  onMouseleave: () => void
  onMousedown: (event: MouseEvent) => void
  onMouseup: () => void
  onFocus: () => void
  onBlur: () => void
}

export function useMapObject(
  styles: MaybeRef<Partial<Record<MapObjectState, StyleValue>> | undefined>,
): UseMapObjectResult {
  const state = ref<MapObjectState>('default')
  const insideZoom = Boolean(useMapZoom())

  const {
    onMouseenter,
    onMouseleave,
    onMouseup,
    onMousedown,
    onFocus,
    onBlur,
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
    onFocus,
    onBlur,
  }
}
