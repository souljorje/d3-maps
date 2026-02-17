import type {
  MapObjectEvent,
  MapObjectEventType,
  MapObjectState,
  MapObjectStyles,
} from '@d3-maps/core'
import type { ComputedRef, MaybeRef, StyleValue } from 'vue'

import {
  getObjectStateUpdate,
  resolveObjectStyle,
} from '@d3-maps/core'
import {
  computed,
  ref,
  unref,
} from 'vue'

export type MapObjectEmit = <E extends MapObjectEventType>(
  event: E,
  payload: MapObjectEvent<E>,
) => void

export interface UseMapObjectResult {
  computedStyle: ComputedRef<StyleValue | undefined>
  onMouseEnter: (event: MouseEvent) => void
  onMouseLeave: (event: MouseEvent) => void
  onMouseDown: (event: MouseEvent) => void
  onMouseUp: (event: MouseEvent) => void
  onFocus: (event: FocusEvent) => void
  onBlur: (event: FocusEvent) => void
}

export function useMapObject(
  emit: MapObjectEmit,
  styles: MaybeRef<MapObjectStyles<StyleValue> | undefined>,
): UseMapObjectResult {
  const state = ref<MapObjectState>('default')

  const eventCallbackFactory = <E extends MapObjectEventType>(eventName: E) =>
    (event: MapObjectEvent<E>) => {
      state.value = getObjectStateUpdate(eventName)
      emit(eventName, event)
    }

  const computedStyle = computed(() => resolveObjectStyle(state.value, unref(styles)))

  return {
    computedStyle,
    onMouseEnter: eventCallbackFactory('mouseenter'),
    onMouseLeave: eventCallbackFactory('mouseleave'),
    onMouseDown: eventCallbackFactory('mousedown'),
    onMouseUp: eventCallbackFactory('mouseup'),
    onFocus: eventCallbackFactory('focus'),
    onBlur: eventCallbackFactory('blur'),
  }
}
