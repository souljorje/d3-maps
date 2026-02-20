'use client'

import type {
  MapObjectEventType,
  MapObjectState,
  MapObjectStyles,
} from '@d3-maps/core'
import type {
  FocusEventHandler,
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

export interface UseMapObjectOptions<TElement extends Element, TStyle> {
  styles?: MapObjectStyles<TStyle>
  onMouseEnter?: MouseEventHandler<TElement>
  onMouseLeave?: MouseEventHandler<TElement>
  onMouseDown?: MouseEventHandler<TElement>
  onMouseUp?: MouseEventHandler<TElement>
  onClick?: MouseEventHandler<TElement>
  onFocus?: FocusEventHandler<TElement>
  onBlur?: FocusEventHandler<TElement>
}

export interface UseMapObjectResult<TElement extends Element, TStyle> {
  computedStyle: TStyle | undefined
  onMouseEnter: MouseEventHandler<TElement>
  onMouseLeave: MouseEventHandler<TElement>
  onMouseDown: MouseEventHandler<TElement>
  onMouseUp: MouseEventHandler<TElement>
  onClick: MouseEventHandler<TElement>
  onFocus: FocusEventHandler<TElement>
  onBlur: FocusEventHandler<TElement>
}

export function useMapObject<TElement extends Element, TStyle>(
  options: UseMapObjectOptions<TElement, TStyle>,
): UseMapObjectResult<TElement, TStyle> {
  const [state, setState] = useState<MapObjectState>('default')

  const onMouseEnterRef = useLatest(options.onMouseEnter)
  const onMouseLeaveRef = useLatest(options.onMouseLeave)
  const onMouseDownRef = useLatest(options.onMouseDown)
  const onMouseUpRef = useLatest(options.onMouseUp)
  const onClickRef = useLatest(options.onClick)
  const onFocusRef = useLatest(options.onFocus)
  const onBlurRef = useLatest(options.onBlur)

  const setStateForEvent = useCallback((eventName: MapObjectEventType) => {
    setState((currentState) => {
      const nextState = getObjectStateUpdate(eventName)
      return currentState === nextState ? currentState : nextState
    })
  }, [])

  const computedStyle = useMemo(() => {
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

  const onClick = useCallback<MouseEventHandler<TElement>>((event) => {
    setStateForEvent('mouseup')
    onClickRef.current?.(event)
  }, [setStateForEvent])

  const onFocus = useCallback<FocusEventHandler<TElement>>((event) => {
    setStateForEvent('focus')
    onFocusRef.current?.(event)
  }, [setStateForEvent])

  const onBlur = useCallback<FocusEventHandler<TElement>>((event) => {
    setStateForEvent('blur')
    onBlurRef.current?.(event)
  }, [setStateForEvent])

  return {
    computedStyle,
    onMouseEnter,
    onMouseLeave,
    onMouseDown,
    onMouseUp,
    onClick,
    onFocus,
    onBlur,
  }
}
