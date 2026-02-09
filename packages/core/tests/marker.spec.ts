import { describe, expect, it } from 'vitest'
import { getMarkerTransform } from '../src'
import { makeTestMapContext } from './fixtures'

describe('getMarkerTransform', () => {
  it('returns fallback when projection is missing', () => {
    expect(getMarkerTransform(undefined, [10, 20])).toBe('translate(0, 0)')
  })

  it('uses projection from map context', () => {
    const context = makeTestMapContext()
    const transform = getMarkerTransform(context, [10, 20])
    expect(transform.startsWith('translate(')).toBe(true)
  })
})
