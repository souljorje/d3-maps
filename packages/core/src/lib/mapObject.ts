import type {
  ExtendedFeature,
  GeoGeometryObjects,
} from 'd3-geo'

import {
  isElement,
  isObject,
} from './utils'

export type MapObjectData = GeoGeometryObjects | ExtendedFeature

export type MapObjectEventType = 'mouseenter' | 'mouseleave' | 'mousedown' | 'mouseup' | 'focus' | 'blur'
export type MapObjectGlobalMouseupListener = () => void
export type MapObjectGlobalMouseupSubscription = (
  listener: MapObjectGlobalMouseupListener,
) => (() => void)
function noop(): void {}

export function subscribeWindow(
  ev: string,
  listener: MapObjectGlobalMouseupListener,
): () => void {
  if (typeof window === 'undefined') return noop
  window.addEventListener(ev, listener, true)
  return () => {
    window.removeEventListener(ev, listener, true)
  }
}

/**
 * Supported interaction states for map objects.
 */
export const mapObjectState = ['default', 'hover', 'active', 'focus'] as const
export type MapObjectState = typeof mapObjectState[number]
export interface MapObjectProps<TStyle = unknown> {
  styles?: Partial<Record<MapObjectState, TStyle>>
}

export type ElementMapObjectMouseDownSource =
  | Element
  | { currentTarget: EventTarget | null }
  | null
  | undefined
export type MapObjectMouseDownSource<TTarget = unknown> =
  | TTarget
  | ElementMapObjectMouseDownSource

export interface MapObjectInteractionController<TTarget = unknown> {
  onMouseenter: () => MapObjectState
  onMouseleave: () => MapObjectState
  onMousedown: (source?: MapObjectMouseDownSource<TTarget>) => MapObjectState
  onMouseup: () => MapObjectState
  onFocus: () => MapObjectState
  onBlur: () => MapObjectState
  dispose: () => void
}

/**
 * Maps DOM event names to interaction state updates.
 */
export function getObjectStateUpdate(event: MapObjectEventType): MapObjectState {
  switch (event) {
    case 'mouseenter':
    case 'mouseup':
      return 'hover'
    case 'mouseleave':
    case 'blur':
      return 'default'
    case 'mousedown':
      return 'active'
    case 'focus':
      return 'focus'
    default:
      return 'default'
  }
}

/**
 * Resolves a style value for the current state (falls back to `default`).
 */
export function resolveObjectStyle<TStyle>(
  state: MapObjectState,
  styles?: MapObjectProps<TStyle>['styles'],
): TStyle | undefined {
  return styles?.[state] ?? styles?.default
}

export function useMapObjectEvents<TTarget = unknown>(
  onStateChange?: (state: MapObjectState) => void,
  recoverOnGlobalMouseup = false,
): MapObjectInteractionController<TTarget> {
  let state: MapObjectState = 'default'
  let isHovered = false
  let isFocused = false
  let isActive = false
  let pressedTarget: MapObjectMouseDownSource<TTarget> = null
  let removeGlobalMouseup: () => void = noop

  const getResolvedState = (): MapObjectState => {
    if (isActive) return 'active'
    if (isFocused) return 'focus'
    if (isHovered) return 'hover'
    return 'default'
  }

  const setState = (nextState: MapObjectState): MapObjectState => {
    if (state === nextState) return state
    state = nextState
    onStateChange?.(state)
    return state
  }

  const syncState = (): MapObjectState => {
    return setState(getResolvedState())
  }

  const clearInteraction = (): void => {
    isActive = false
    pressedTarget = null
    removeGlobalMouseup()
    removeGlobalMouseup = noop
  }

  const registerGlobalMouseup = (): void => {
    if (!recoverOnGlobalMouseup) return

    const onGlobalMouseup = (): MapObjectState => {
      isHovered = isHoveredSource(pressedTarget)
      clearInteraction()
      return syncState()
    }
    removeGlobalMouseup()
    removeGlobalMouseup = subscribeWindow('mouseup', onGlobalMouseup)
  }

  return {
    onMouseenter: () => {
      isHovered = true
      return syncState()
    },
    onMouseleave: () => {
      isHovered = false
      clearInteraction()
      return syncState()
    },
    onMousedown: (source) => {
      isActive = true
      pressedTarget = normalizeMouseDownSource(source)
      registerGlobalMouseup()
      return syncState()
    },
    onMouseup: () => {
      clearInteraction()
      return syncState()
    },
    onFocus: () => {
      isFocused = true
      return syncState()
    },
    onBlur: () => {
      isFocused = false
      clearInteraction()
      return syncState()
    },
    dispose: () => clearInteraction(),
  }
}

function getElementTarget(source: unknown): Element | null {
  if (isElement(source)) return source
  if (!isObject(source)) return null
  if (!('currentTarget' in source)) return null
  return isElement(source.currentTarget) ? source.currentTarget : null
}

function normalizeMouseDownSource<TTarget>(
  source: MapObjectMouseDownSource<TTarget>,
): MapObjectMouseDownSource<TTarget> {
  return getElementTarget(source) ?? source ?? null
}

function isHoveredSource(source: unknown): boolean {
  const target = getElementTarget(source)
  if (!isElement(target)) return false
  try {
    return target.matches(':hover')
  } catch {
    return false
  }
}
