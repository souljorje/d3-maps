'use client'

import type {
  MapObjectStyles as CoreMapObjectStyles,
  MapObjectEventType,
  MapObjectState,
} from '@d3-maps/core'
import type {
  CSSProperties,
  MouseEventHandler,
} from 'react'

import {
  getObjectStateUpdate,
  resolveObjectStyle,
} from '@d3-maps/core'
import {
  useCallback,
  useMemo,
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

  const onMouseEnterRef = useLatest(options.onMouseEnter)
  const onMouseLeaveRef = useLatest(options.onMouseLeave)
  const onMouseDownRef = useLatest(options.onMouseDown)
  const onMouseUpRef = useLatest(options.onMouseUp)

  const setStateForEvent = useCallback((eventName: MapObjectEventType) => {
    setState((currentState) => {
      const nextState = getObjectStateUpdate(eventName)
      return currentState === nextState ? currentState : nextState
    })
  }, [])

  const style = useMemo(() => {
    return resolveObjectStyle(state, options.styles)
  }, [state, options.styles])

  const onMouseEnter = useCallback<MouseEventHandler<TElement>>((event) => {
    setStateForEvent('mouseenter')
    onMouseEnterRef.current?.(event)
  }, [setStateForEvent])

  const onMouseLeave = useCallback<MouseEventHandler<TElement>>((event) => {
    setStateForEvent('mouseleave')
    onMouseLeaveRef.current?.(event)
  }, [setStateForEvent])

  const onMouseDown = useCallback<MouseEventHandler<TElement>>((event) => {
    setStateForEvent('mousedown')
    onMouseDownRef.current?.(event)
  }, [setStateForEvent])

  const onMouseUp = useCallback<MouseEventHandler<TElement>>((event) => {
    setStateForEvent('mouseup')
    onMouseUpRef.current?.(event)
  }, [setStateForEvent])

  return {
    style,
    onMouseEnter,
    onMouseLeave,
    onMouseDown,
    onMouseUp,
  }
}
