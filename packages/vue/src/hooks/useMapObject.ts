import type {
  MapObjectEventType,
  MapObjectState,
  MapObjectStyles as TMapObjectStyles,
} from '@d3-maps/core'
import type {
  ComputedRef,
  MaybeRef,
  StyleValue,
} from 'vue'

import {
  getObjectStateUpdate,
  resolveObjectStyle,
} from '@d3-maps/core'
import {
  computed,
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

  const eventCallbackFactory = <E extends MapObjectEventType>(eventName: E) =>
    () => {
      state.value = getObjectStateUpdate(eventName)
    }

  const style = computed(() => resolveObjectStyle(state.value, unref(styles)))

  return {
    style,
    onMouseenter: eventCallbackFactory('mouseenter'),
    onMouseleave: eventCallbackFactory('mouseleave'),
    onMousedown: eventCallbackFactory('mousedown'),
    onMouseup: eventCallbackFactory('mouseup'),
  }
}
