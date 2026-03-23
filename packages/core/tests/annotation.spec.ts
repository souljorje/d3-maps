import { describe, expect, it } from 'vitest'

import { getAnnotationGeometry } from '../src'

describe('getAnnotationGeometry', () => {
  it('uses default geometry values when no options are provided', () => {
    expect(getAnnotationGeometry()).toEqual({
      lineTransform: 'rotate(-45)',
      lineCoordinates: [
        [0, 0],
        [30, 0],
      ],
      contentTransform: 'translate(21.213203435596427, -21.213203435596423) scale(1)',
    })
  })

  it('computes content transforms from line options', () => {
    const geometry = getAnnotationGeometry({
      angle: 0,
      margin: 10,
      length: 20,
    })

    expect(geometry).toEqual({
      lineTransform: 'rotate(0)',
      lineCoordinates: [
        [10, 0],
        [30, 0],
      ],
      contentTransform: 'translate(30, 0) scale(1)',
    })
  })

  it('keeps connector coordinates in local rotated space', () => {
    const geometry = getAnnotationGeometry({
      angle: -15,
      margin: 0,
      length: 40,
    })

    expect(geometry.lineTransform).toBe('rotate(-15)')
    expect(geometry.lineCoordinates).toEqual([
      [0, 0],
      [40, 0],
    ])
  })

  it('keeps connector geometry independent from curve interpolation', () => {
    const geometry = getAnnotationGeometry({
      length: 40,
      margin: 2,
    })

    expect(geometry.lineCoordinates).toEqual([
      [2, 0],
      [42, 0],
    ])
  })
})
