import { describe, expect, it } from 'vitest'

import {
  resolveInteractionStyle,
  useInteractionEvents,
} from '../src'

describe('resolveInteractionStyle', () => {
  it('resolves style by interactive state with fallback to default', () => {
    const styles = {
      default: { opacity: 0.6 },
      hover: { opacity: 0.8 },
      active: { opacity: 1 },
      focus: { opacity: 0.7 },
    }

    expect(resolveInteractionStyle('active', styles)).toEqual(styles.active)
    expect(resolveInteractionStyle('hover', styles)).toEqual(styles.hover)
    expect(resolveInteractionStyle('focus', styles)).toEqual(styles.focus)
    expect(resolveInteractionStyle('default', styles)).toEqual(styles.default)
  })

  it('falls back to default style when current state is missing', () => {
    const styles = { default: { opacity: 0.4 } }
    expect(resolveInteractionStyle('hover', styles)).toEqual(styles.default)
  })

  it('returns undefined when styles are not provided', () => {
    expect(resolveInteractionStyle('hover')).toBeUndefined()
  })
})

describe('useInteractionEvents', () => {
  it('tracks state transitions from mouse events', () => {
    let currentState = 'default'
    const controller = useInteractionEvents((state) => {
      currentState = state
    })

    expect(currentState).toBe('default')
    expect(controller.onMouseenter()).toBe('hover')
    expect(currentState).toBe('hover')
    expect(controller.onMousedown()).toBe('active')
    expect(currentState).toBe('active')
    expect(controller.onMouseup()).toBe('hover')
    expect(currentState).toBe('hover')
    expect(controller.onMouseleave()).toBe('default')
    expect(currentState).toBe('default')
  })

  it('keeps focus style after hover ends until blur', () => {
    let currentState = 'default'
    const controller = useInteractionEvents((state) => {
      currentState = state
    })

    expect(controller.onFocus()).toBe('focus')
    expect(currentState).toBe('focus')
    expect(controller.onMouseenter()).toBe('focus')
    expect(currentState).toBe('focus')
    expect(controller.onMouseleave()).toBe('focus')
    expect(currentState).toBe('focus')
    expect(controller.onBlur()).toBe('default')
    expect(currentState).toBe('default')
  })

  it('returns to focus after mouseup when the element is focused', () => {
    let currentState = 'default'
    const controller = useInteractionEvents((state) => {
      currentState = state
    })

    controller.onFocus()
    expect(currentState).toBe('focus')
    expect(controller.onMousedown()).toBe('active')
    expect(currentState).toBe('active')
    expect(controller.onMouseup()).toBe('focus')
    expect(currentState).toBe('focus')
  })

  it('resets to default on global mouseup when element mouseup is missed', () => {
    const originalWindow = globalThis.window
    const listenerSet = new Set<() => void>()
    ;(globalThis as { window: unknown }).window = {
      addEventListener: (_eventName: string, listener: () => void) => {
        listenerSet.add(listener)
      },
      removeEventListener: (_eventName: string, listener: () => void) => {
        listenerSet.delete(listener)
      },
    }
    let currentState = 'default'
    const controller = useInteractionEvents((state) => {
      currentState = state
    }, true)

    controller.onMousedown({ id: 'feature' })
    expect(currentState).toBe('active')

    for (const listener of listenerSet) listener()
    expect(currentState).toBe('default')
    expect(listenerSet.size).toBe(0)
    ;(globalThis as { window?: unknown }).window = originalWindow
  })

  it('cleans up active global mouseup subscription on dispose', () => {
    const originalWindow = globalThis.window
    const listenerSet = new Set<() => void>()
    ;(globalThis as { window: unknown }).window = {
      addEventListener: (_eventName: string, listener: () => void) => {
        listenerSet.add(listener)
      },
      removeEventListener: (_eventName: string, listener: () => void) => {
        listenerSet.delete(listener)
      },
    }

    const controller = useInteractionEvents(undefined, true)

    controller.onMousedown({ id: 'feature' })
    controller.dispose()

    expect(listenerSet.size).toBe(0)
    ;(globalThis as { window?: unknown }).window = originalWindow
  })

  it('does not subscribe to global mouseup by default', () => {
    const originalWindow = globalThis.window
    const listenerSet = new Set<() => void>()
    ;(globalThis as { window: unknown }).window = {
      addEventListener: (_eventName: string, listener: () => void) => {
        listenerSet.add(listener)
      },
      removeEventListener: (_eventName: string, listener: () => void) => {
        listenerSet.delete(listener)
      },
    }

    const controller = useInteractionEvents()
    controller.onMousedown({ id: 'feature' })

    expect(listenerSet.size).toBe(0)
    ;(globalThis as { window?: unknown }).window = originalWindow
  })
})
