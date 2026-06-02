'use client'

import type {
  InteractionController,
  InteractionState,
  MapElementProps,
} from '@d3-maps/core'
import type {
  CSSProperties,
  FocusEventHandler,
  MouseEventHandler,
} from 'react'

import {
  resolveInteractionStyle,
  useInteractionEvents,
} from '@d3-maps/core'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { useLatest } from './useLatest'
import { useMapZoom } from './useMapZoom'

interface MapElementEventHandlers<T extends Element> {
  onMouseEnter: MouseEventHandler<T>
  onMouseLeave: MouseEventHandler<T>
  onMouseDown: MouseEventHandler<T>
  onMouseUp: MouseEventHandler<T>
  onFocus: FocusEventHandler<T>
  onBlur: FocusEventHandler<T>
}

export interface UseInteractionOptions<TElement extends Element>
  extends MapElementProps<CSSProperties>,
  Partial<MapElementEventHandlers<TElement>> {}

export interface UseInteractionResult<TElement extends Element>
  extends MapElementEventHandlers<TElement> {
  style?: CSSProperties
}

export function useInteraction<TElement extends Element>(
  options: UseInteractionOptions<TElement>,
): UseInteractionResult<TElement> {
  const [state, setState] = useState<InteractionState>('default')
  const stateRef = useRef(state)
  const insideZoom = Boolean(useMapZoom())

  // Keep stable DOM handlers while still calling the latest user callbacks
  const onMouseEnterRef = useLatest(options.onMouseEnter)
  const onMouseLeaveRef = useLatest(options.onMouseLeave)
  const onMouseDownRef = useLatest(options.onMouseDown)
  const onMouseUpRef = useLatest(options.onMouseUp)
  const onFocusRef = useLatest(options.onFocus)
  const onBlurRef = useLatest(options.onBlur)

  useEffect(() => {
    stateRef.current = state
  }, [state])

  const syncState = useCallback((nextState: InteractionState) => {
    if (stateRef.current === nextState) return
    stateRef.current = nextState
    setState(nextState)
  }, [])

  const interactionController = useMemo<InteractionController<MouseEvent>>(() => {
    return useInteractionEvents(syncState, insideZoom)
  }, [insideZoom, syncState])

  useEffect(() => {
    return () => {
      interactionController.dispose()
    }
  }, [interactionController])

  const style = useMemo(() => resolveInteractionStyle(state, options.styles), [state, options.styles])

  const onMouseEnter = useCallback<MouseEventHandler<TElement>>((event) => {
    interactionController.onMouseenter()
    onMouseEnterRef.current?.(event)
  }, [interactionController])

  const onMouseLeave = useCallback<MouseEventHandler<TElement>>((event) => {
    interactionController.onMouseleave()
    onMouseLeaveRef.current?.(event)
  }, [interactionController])

  const onMouseDown = useCallback<MouseEventHandler<TElement>>((event) => {
    interactionController.onMousedown(event)
    onMouseDownRef.current?.(event)
  }, [interactionController])

  const onMouseUp = useCallback<MouseEventHandler<TElement>>((event) => {
    interactionController.onMouseup()
    onMouseUpRef.current?.(event)
  }, [interactionController])

  const onFocus = useCallback<FocusEventHandler<TElement>>((event) => {
    interactionController.onFocus()
    onFocusRef.current?.(event)
  }, [interactionController])

  const onBlur = useCallback<FocusEventHandler<TElement>>((event) => {
    interactionController.onBlur()
    onBlurRef.current?.(event)
  }, [interactionController])

  return {
    style,
    onMouseEnter,
    onMouseLeave,
    onMouseDown,
    onMouseUp,
    onFocus,
    onBlur,
  }
}
