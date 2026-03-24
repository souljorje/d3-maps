import { describe, expect, it } from 'vitest'

import { getMarkerTransform } from '../src'
import { makeTestMapContext } from './fixtures'

describe('getMarkerTransform', () => {
  it('returns undefined when projection is missing', () => {
    expect(getMarkerTransform(undefined, [10, 20])).toBeUndefined()
  })

  it('uses projection from map context', () => {
    const context = makeTestMapContext()
    const transform = getMarkerTransform(context, [10, 20])
    expect(transform).toBeDefined()
    if (!transform) return
    expect(transform.startsWith('translate(')).toBe(true)
  })
})
