import {
  isElement,
  isObject,
  noop,
} from './utils'

export const interactionState = ['default', 'hover', 'active', 'focus'] as const
export type InteractionState = typeof interactionState[number]

export type InteractionStyles<TStyle = unknown> = Partial<Record<InteractionState, TStyle>>

export interface InteractionProps<TStyle = unknown> {
  styles?: InteractionStyles<TStyle>
}

export type InteractionEventType = 'mouseenter' | 'mouseleave' | 'mousedown' | 'mouseup' | 'focus' | 'blur'
export type GlobalMouseupListener = () => void
export type GlobalMouseupSubscription = (
  listener: GlobalMouseupListener,
) => (() => void)

export type ElementMouseDownSource =
  | Element
  | { currentTarget: EventTarget | null }
  | null
  | undefined
export type MouseDownSource<TTarget = unknown> =
  | TTarget
  | ElementMouseDownSource

export interface InteractionController<TTarget = unknown> {
  onMouseenter: () => InteractionState
  onMouseleave: () => InteractionState
  onMousedown: (source?: MouseDownSource<TTarget>) => InteractionState
  onMouseup: () => InteractionState
  onFocus: () => InteractionState
  onBlur: () => InteractionState
  dispose: () => void
}

export function resolveInteractionStyle<TStyle>(
  state: InteractionState,
  styles?: InteractionStyles<TStyle>,
): TStyle | undefined {
  return styles?.[state] ?? styles?.default
}

export function useInteractionEvents<TTarget = unknown>(
  onStateChange?: (state: InteractionState) => void,
  recoverOnGlobalMouseup = false,
): InteractionController<TTarget> {
  let state: InteractionState = 'default'
  let isHovered = false
  let isFocused = false
  let isActive = false
  let pressedTarget: MouseDownSource<TTarget> = null
  let removeGlobalMouseup: () => void = noop

  const getResolvedState = (): InteractionState => {
    if (isActive) return 'active'
    if (isFocused) return 'focus'
    if (isHovered) return 'hover'
    return 'default'
  }

  const setState = (nextState: InteractionState): InteractionState => {
    if (state === nextState) return state
    state = nextState
    onStateChange?.(state)
    return state
  }

  const syncState = (): InteractionState => {
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

    const onGlobalMouseup = (): InteractionState => {
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
  source: MouseDownSource<TTarget>,
): MouseDownSource<TTarget> {
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

function subscribeWindow(
  ev: string,
  listener: GlobalMouseupListener,
): () => void {
  if (typeof window === 'undefined') return noop
  window.addEventListener(ev, listener, true)
  return () => {
    window.removeEventListener(ev, listener, true)
  }
}
