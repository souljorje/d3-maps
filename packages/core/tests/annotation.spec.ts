import { describe, expect, it } from 'vitest'

import { getAnnotationGeometry } from '../src'

function offsetCurve(context: {
  moveTo: (x: number, y: number) => void
  lineTo: (x: number, y: number) => void
}) {
  let pointIndex = 0

  return {
    lineStart() {
      pointIndex = 0
    },
    lineEnd() {},
    point(x: number, y: number) {
      if (pointIndex === 0) {
        context.moveTo(x, y)
      } else {
        context.lineTo(x, y + 1)
      }

      pointIndex += 1
    },
  }
}

describe('getAnnotationGeometry', () => {
  it('uses default geometry values when no options are provided', () => {
    expect(getAnnotationGeometry()).toEqual({
      lineTransform: 'rotate(-45)',
      linePath: 'M0,0L30,0',
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
      linePath: 'M10,0L30,0',
      contentTransform: 'translate(30, 0) scale(1)',
    })
  })

  it('keeps connector coordinates in local rotated space', () => {
    const geometry = getAnnotationGeometry({
      angle: -15,
      margin: 0,
      length: 40,
    })

    expect(geometry?.lineTransform).toBe('rotate(-15)')
    expect(geometry?.linePath).toBe('M0,0L40,0')
  })

  it('uses the provided D3 curve when present', () => {
    const linearGeometry = getAnnotationGeometry({
      length: 40,
    })
    const curvedGeometry = getAnnotationGeometry({
      length: 40,
      curve: offsetCurve,
    })

    expect(curvedGeometry.linePath).toBeDefined()
    expect(curvedGeometry.linePath).not.toBe(linearGeometry.linePath)
  })

  it('uses the manual connector renderer when curve is numeric', () => {
    const straightGeometry = getAnnotationGeometry({
      length: 40,
    })
    const manualCurveGeometry = getAnnotationGeometry({
      length: 40,
      curve: 0.5,
    })

    expect(manualCurveGeometry.linePath).toBeDefined()
    expect(manualCurveGeometry.linePath).not.toBe(straightGeometry.linePath)
    expect(manualCurveGeometry.linePath).toBe('M0,0Q30,0 40,0')
  })

  it('uses numeric curve values to control connector curvature', () => {
    const subtleCurveGeometry = getAnnotationGeometry({
      length: 40,
      curve: 0.25,
    })
    const pronouncedCurveGeometry = getAnnotationGeometry({
      length: 40,
      curve: 0.75,
    })

    expect(pronouncedCurveGeometry.linePath).not.toBe(subtleCurveGeometry.linePath)
  })
})
