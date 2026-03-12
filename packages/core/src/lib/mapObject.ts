import type {
  ExtendedFeature,
  GeoGeometryObjects,
} from 'd3-geo'

import {
  isElement,
  isObject,
} from './utils'

export type MapObjectData = GeoGeometryObjects | ExtendedFeature

export type MapObjectEventType = 'mouseenter' | 'mouseleave' | 'mousedown' | 'mouseup'
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
export const mapObjectState = ['default', 'hover', 'active'] as const
export type MapObjectState = typeof mapObjectState[number]
export interface MapObject<TStyle = unknown> {
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
      return 'default'
    case 'mousedown':
      return 'active'
    default:
      return 'default'
  }
}

/**
 * Resolves a style value for the current state (falls back to `default`).
 */
export function resolveObjectStyle<TStyle>(
  state: MapObjectState,
  styles?: MapObject<TStyle>['styles'],
): TStyle | undefined {
  return styles?.[state] ?? styles?.default
}

export function useMapObjectEvents<TTarget = unknown>(
  onStateChange?: (state: MapObjectState) => void,
  recoverOnGlobalMouseup = false,
): MapObjectInteractionController<TTarget> {
  let state: MapObjectState = 'default'
  let pressedTarget: MapObjectMouseDownSource<TTarget> = null
  let removeGlobalMouseup: () => void = noop

  const setState = (nextState: MapObjectState): MapObjectState => {
    if (state === nextState) return state
    state = nextState
    onStateChange?.(state)
    return state
  }

  const setStateForEvent = (event: MapObjectEventType): MapObjectState => {
    return setState(getObjectStateUpdate(event))
  }

  const clearInteraction = (): void => {
    pressedTarget = null
    removeGlobalMouseup()
    removeGlobalMouseup = noop
  }

  const registerGlobalMouseup = (): void => {
    if (!recoverOnGlobalMouseup) return

    const onGlobalMouseup = (): MapObjectState => {
      const nextState = isHoveredSource(pressedTarget) ? 'hover' : 'default'
      clearInteraction()
      return setState(nextState)
    }
    removeGlobalMouseup()
    removeGlobalMouseup = subscribeWindow('mouseup', onGlobalMouseup)
  }

  return {
    onMouseenter: () => setStateForEvent('mouseenter'),
    onMouseleave: () => {
      clearInteraction()
      return setStateForEvent('mouseleave')
    },
    onMousedown: (source) => {
      pressedTarget = normalizeMouseDownSource(source)
      registerGlobalMouseup()
      return setStateForEvent('mousedown')
    },
    onMouseup: () => {
      clearInteraction()
      return setStateForEvent('mouseup')
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
