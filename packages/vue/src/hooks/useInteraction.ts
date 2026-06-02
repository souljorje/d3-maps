import type {
  InteractionController,
  InteractionState,
  InteractionStyles,
} from '@d3-maps/core'
import type {
  ComputedRef,
  MaybeRef,
  StyleValue,
} from 'vue'

import {
  resolveInteractionStyle,
  useInteractionEvents,
} from '@d3-maps/core'
import {
  computed,
  onBeforeUnmount,
  ref,
  unref,
} from 'vue'

import { useMapZoom } from './useMapZoom'

export interface UseInteractionResult {
  style: ComputedRef<StyleValue | undefined>
  onMouseenter: () => void
  onMouseleave: () => void
  onMousedown: (event: MouseEvent) => void
  onMouseup: () => void
  onFocus: () => void
  onBlur: () => void
}

export function useInteraction(
  styles: MaybeRef<InteractionStyles<StyleValue> | undefined>,
): UseInteractionResult {
  const state = ref<InteractionState>('default')
  const insideZoom = Boolean(useMapZoom())

  const {
    onMouseenter,
    onMouseleave,
    onMouseup,
    onMousedown,
    onFocus,
    onBlur,
    dispose,
  }: InteractionController<MouseEvent> = useInteractionEvents((nextState) => {
    state.value = nextState
  }, insideZoom)

  onBeforeUnmount(() => {
    dispose()
  })

  const style = computed(() => resolveInteractionStyle(state.value, unref(styles)))

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
