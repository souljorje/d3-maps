'use client'

import type {
  MapObjectStyles as CoreMapObjectStyles,
  MapObjectInteractionController,
  MapObjectState,
} from '@d3-maps/core'
import type {
  CSSProperties,
  MouseEventHandler,
} from 'react'

import {
  resolveObjectStyle,
  useMapObjectEvents,
} from '@d3-maps/core'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { useLatest } from './useLatest'

export type MapObjectStyle = CSSProperties
export type MapObjectStyles = CoreMapObjectStyles<MapObjectStyle>

export interface UseMapObjectOptions<TElement extends Element> {
  styles?: MapObjectStyles
  onMouseEnter?: MouseEventHandler<TElement>
  onMouseLeave?: MouseEventHandler<TElement>
  onMouseDown?: MouseEventHandler<TElement>
  onMouseUp?: MouseEventHandler<TElement>
}

export interface UseMapObjectResult<TElement extends Element> {
  style: MapObjectStyle | undefined
  onMouseEnter: MouseEventHandler<TElement>
  onMouseLeave: MouseEventHandler<TElement>
  onMouseDown: MouseEventHandler<TElement>
  onMouseUp: MouseEventHandler<TElement>
}

export function useMapObject<TElement extends Element>(
  options: UseMapObjectOptions<TElement>,
): UseMapObjectResult<TElement> {
  const [state, setState] = useState<MapObjectState>('default')
  const stateRef = useRef(state)

  const onMouseEnterRef = useLatest(options.onMouseEnter)
  const onMouseLeaveRef = useLatest(options.onMouseLeave)
  const onMouseDownRef = useLatest(options.onMouseDown)
  const onMouseUpRef = useLatest(options.onMouseUp)

  useEffect(() => {
    stateRef.current = state
  }, [state])

  const syncState = useCallback((nextState: MapObjectState) => {
    if (stateRef.current === nextState) return
    stateRef.current = nextState
    setState(nextState)
  }, [])

  const interactionController = useMemo<MapObjectInteractionController<MouseEvent>>(() => {
    return useMapObjectEvents(syncState)
  }, [syncState])

  useEffect(() => {
    return () => {
      interactionController.dispose()
    }
  }, [interactionController])

  const style = useMemo(() => resolveObjectStyle(state, options.styles), [state, options.styles])

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

  return {
    style,
    onMouseEnter,
    onMouseLeave,
    onMouseDown,
    onMouseUp,
  }
}
