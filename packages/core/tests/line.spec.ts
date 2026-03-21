import { describe, expect, it } from 'vitest'

import { curveBasis } from 'd3-shape'

import {
  getConnectorLinePath,
  getLinePath,
} from '../src'
import { makeTestMapContext } from './fixtures'

const LINE_COORDINATES: [number, number][] = [
  [-122.4194, 37.7749],
  [-73.935242, 40.73061],
]
const THREE_POINT_COORDINATES: [number, number][] = [
  [-122.4194, 37.7749],
  [-98.5795, 39.8283],
  [-73.935242, 40.73061],
]
describe('getLinePath', () => {
  it('returns undefined when map context is missing', () => {
    expect(getLinePath(undefined, LINE_COORDINATES)).toBeUndefined()
  })

  it('returns undefined when less than two coordinates are provided', () => {
    const context = makeTestMapContext()

    expect(getLinePath(context, [LINE_COORDINATES[0]])).toBeUndefined()
  })

  it('renders a geographic LineString path', () => {
    const context = makeTestMapContext()

    const path = getLinePath(context, LINE_COORDINATES)
    const expectedPath = context.path({
      type: 'LineString',
      coordinates: LINE_COORDINATES,
    })

    expect(path).toBe(expectedPath)
  })

  it('renders a custom projected path when custom is enabled', () => {
    const context = makeTestMapContext()

    const path = getLinePath(context, THREE_POINT_COORDINATES, true)

    expect(path).toMatch(/^M/)
  })

  it('uses the provided D3 curve for custom paths', () => {
    const context = makeTestMapContext()

    const linearPath = getLinePath(context, THREE_POINT_COORDINATES, true)
    const curvedPath = getLinePath(context, THREE_POINT_COORDINATES, true, curveBasis)

    expect(curvedPath).toBeDefined()
    expect(curvedPath).not.toBe(linearPath)
  })

  it('uses the manual connector renderer when curve is numeric', () => {
    const context = makeTestMapContext()

    const d3Path = getLinePath(context, THREE_POINT_COORDINATES, true)
    const connectorPath = getLinePath(context, THREE_POINT_COORDINATES, true, 0.5)

    expect(connectorPath).toBeDefined()
    expect(connectorPath).not.toBe(d3Path)
  })
})

describe('getConnectorLinePath', () => {
  it('renders a single connector segment', () => {
    expect(getConnectorLinePath([
      [0, 0],
      [40, 0],
    ], 0.5)).toBe('M0,0Q30,0 40,0')
  })

  it('chains connector segments for multi-point paths', () => {
    expect(getConnectorLinePath([
      [0, 0],
      [40, 0],
      [70, 20],
    ], 0.5)).toBe('M0,0Q30,0 40,0Q62.5,5 70,20')
  })

  it('clamps manual curve values into the supported range', () => {
    const lowCurvePath = getConnectorLinePath([
      [0, 0],
      [40, 0],
    ], -1)
    const highCurvePath = getConnectorLinePath([
      [0, 0],
      [40, 0],
    ], 4)

    expect(lowCurvePath).toBe('M0,0Q20,0 40,0')
    expect(highCurvePath).toBe('M0,0Q40,0 40,0')
  })
})
