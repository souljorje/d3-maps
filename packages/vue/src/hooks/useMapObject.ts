import type {
  MapObjectInteractionController,
  MapObjectState,
  MapObjectStyles as TMapObjectStyles,
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

export type MapObjectStyles = TMapObjectStyles<StyleValue>

export interface UseMapObjectResult {
  style: ComputedRef<StyleValue | undefined>
  onMouseenter: (event: MouseEvent) => void
  onMouseleave: (event: MouseEvent) => void
  onMousedown: (event: MouseEvent) => void
  onMouseup: (event: MouseEvent) => void
}

export function useMapObject(
  styles: MaybeRef<MapObjectStyles | undefined>,
): UseMapObjectResult {
  const state = ref<MapObjectState>('default')

  const {
    onMouseenter,
    onMouseleave,
    onMouseup,
    onMousedown,
    dispose,
  }: MapObjectInteractionController<MouseEvent> = useMapObjectEvents((nextState) => {
    state.value = nextState
  })

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
