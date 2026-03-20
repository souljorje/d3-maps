import { describe, expect, it } from 'vitest'

import { getAnnotationGeometry } from '../src'
import { makeTestMapContext } from './fixtures'

const ANCHOR: [number, number] = [2.3522, 48.8566]

describe('getAnnotationGeometry', () => {
  it('returns undefined when map context is missing', () => {
    expect(getAnnotationGeometry(undefined, ANCHOR)).toBeUndefined()
  })

  it('computes anchor and content transforms from projected coordinates', () => {
    const context = makeTestMapContext()
    const geometry = getAnnotationGeometry(context, ANCHOR, {
      angle: 0,
      margin: 10,
      length: 20,
    })

    expect(geometry).toEqual({
      anchorTransform: `translate(${context.projection!(ANCHOR)![0]}, ${context.projection!(ANCHOR)![1]}) scale(1)`,
      connectorTransform: 'rotate(0)',
      connectorPath: 'M10,0L30,0',
      contentTransform: 'translate(30, 0) scale(1)',
    })
  })

  it('keeps connector coordinates in local rotated space', () => {
    const context = makeTestMapContext()
    const geometry = getAnnotationGeometry(context, ANCHOR, {
      angle: -15,
      margin: 0,
      length: 40,
    })

    expect(geometry?.anchorTransform).not.toContain('rotate')
    expect(geometry?.connectorTransform).toBe('rotate(-15)')
    expect(geometry?.connectorPath).toBe('M0,0L40,0')
  })
})
