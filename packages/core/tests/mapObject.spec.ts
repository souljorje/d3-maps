import { describe, expect, it } from 'vitest'

import {
  getObjectStateUpdate,
  resolveObjectStyle,
  useMapObjectEvents,
} from '../src'

describe('getObjectStateUpdate', () => {
  it('returns hover for enter and mouseup events', () => {
    expect(getObjectStateUpdate('mouseenter')).toBe('hover')
    expect(getObjectStateUpdate('mouseup')).toBe('hover')
  })

  it('returns default for mouseleave', () => {
    expect(getObjectStateUpdate('mouseleave')).toBe('default')
  })

  it('returns active on mousedown', () => {
    expect(getObjectStateUpdate('mousedown')).toBe('active')
  })
})

describe('resolveObjectStyle', () => {
  it('resolves style by interactive state with fallback to default', () => {
    const styles = {
      default: { opacity: 0.6 },
      hover: { opacity: 0.8 },
      active: { opacity: 1 },
    }

    expect(resolveObjectStyle('active', styles)).toEqual(styles.active)
    expect(resolveObjectStyle('hover', styles)).toEqual(styles.hover)
    expect(resolveObjectStyle('default', styles)).toEqual(styles.default)
  })

  it('falls back to default style when current state is missing', () => {
    const styles = { default: { opacity: 0.4 } }
    expect(resolveObjectStyle('hover', styles)).toEqual(styles.default)
  })

  it('returns undefined when styles are not provided', () => {
    expect(resolveObjectStyle('hover')).toBeUndefined()
  })
})

describe('useMapObjectEvents', () => {
  it('tracks state transitions from map-object mouse events', () => {
    let currentState = 'default'
    const controller = useMapObjectEvents((state) => {
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
    const controller = useMapObjectEvents((state) => {
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

    const controller = useMapObjectEvents(undefined, true)

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

    const controller = useMapObjectEvents()
    controller.onMousedown({ id: 'feature' })

    expect(listenerSet.size).toBe(0)
    ;(globalThis as { window?: unknown }).window = originalWindow
  })
})
