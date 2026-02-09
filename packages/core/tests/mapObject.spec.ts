import { describe, expect, it } from 'vitest'
import {
  getObjectStateUpdate,
  resolveObjectStyle,
} from '../src'

describe('getObjectStateUpdate', () => {
  it('returns hover for focus-like events', () => {
    expect(getObjectStateUpdate('focus')).toBe('hover')
    expect(getObjectStateUpdate('mouseenter')).toBe('hover')
    expect(getObjectStateUpdate('mouseup')).toBe('hover')
  })

  it('returns default for blur-like events', () => {
    expect(getObjectStateUpdate('blur')).toBe('default')
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
