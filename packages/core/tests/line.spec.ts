import { describe, expect, it } from 'vitest'

import {
  curveBasis,
  curveCardinal,
} from 'd3-shape'

import {
  createMidPoint,
  getDefaultLine,
  getLinePath,
  getLineWithMidpoints,
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
    expect(getLinePath(undefined, {
      coordinates: LINE_COORDINATES,
    })).toBeUndefined()
  })

  it('returns undefined when less than two coordinates are provided', () => {
    const context = makeTestMapContext()

    expect(getLinePath(context, {
      coordinates: [LINE_COORDINATES[0]],
    })).toBeUndefined()
  })

  it('renders a geographic LineString path', () => {
    const context = makeTestMapContext()

    const path = getLinePath(context, {
      coordinates: LINE_COORDINATES,
    })
    const expectedPath = context.path({
      type: 'LineString',
      coordinates: LINE_COORDINATES,
    })

    expect(path).toBe(expectedPath)
  })

  it('renders a custom projected path when custom is enabled', () => {
    const context = makeTestMapContext()

    const path = getLinePath(context, {
      coordinates: THREE_POINT_COORDINATES,
      custom: true,
    })

    expect(path).toMatch(/^M/)
  })

  it('uses the provided D3 curve for custom paths', () => {
    const context = makeTestMapContext()

    const linearPath = getLinePath(context, {
      coordinates: THREE_POINT_COORDINATES,
      custom: true,
    })
    const curvedPath = getLinePath(context, {
      coordinates: THREE_POINT_COORDINATES,
      custom: true,
      curve: curveBasis,
    })

    expect(curvedPath).toBeDefined()
    expect(curvedPath).not.toBe(linearPath)
  })

  it('uses midpoint rendering for numeric curves', () => {
    const context = makeTestMapContext()

    const linearPath = getLinePath(context, {
      coordinates: THREE_POINT_COORDINATES,
      custom: true,
    })
    const midpointPath = getLinePath(context, {
      coordinates: THREE_POINT_COORDINATES,
      custom: true,
      curve: 0.5,
    })

    expect(midpointPath).toBeDefined()
    expect(midpointPath).not.toBe(linearPath)
  })

  it('renders cartesian paths without map context', () => {
    const path = getLinePath(undefined, {
      coordinates: [
        [0, 0],
        [40, 0],
      ],
      cartesian: true,
    })

    expect(path).toBe('M0,0L40,0')
  })

  it('uses midpoint rendering when curveOffset is provided', () => {
    const path = getLinePath(undefined, {
      coordinates: [
        [0, 0],
        [40, 0],
      ],
      cartesian: true,
      curveOffset: [0, -0.4],
    })

    expect(path).toMatch(/^M0,0C/)
    expect(path).not.toBe('M0,0L40,0')
  })
})

describe('createMidPoint', () => {
  it('creates a midpoint with an optional curveOffset', () => {
    expect(createMidPoint([
      [0, 0],
      [40, 20],
    ], [0.2, -0.5])).toEqual([24, 5])
  })
})

describe('getLineWithMidpoints', () => {
  it('renders a single midpoint segment', () => {
    const path = getLineWithMidpoints([
      [0, 0],
      [40, 0],
    ], 0.5)

    expect(path).toMatch(/^M0,0C/)
    expect(path).not.toBe('M0,0L40,0')
  })

  it('inserts midpoints for multi-point paths', () => {
    const linearPath = getDefaultLine(THREE_POINT_COORDINATES)
    const midpointPath = getLineWithMidpoints(THREE_POINT_COORDINATES, 0.5, [0, -0.2])

    expect(midpointPath).toMatch(/^M/)
    expect(midpointPath).not.toBe(linearPath)
  })

  it('clamps numeric curves into the supported range', () => {
    const lowCurvePath = getLineWithMidpoints([
      [0, 0],
      [40, 0],
    ], -1)
    const highCurvePath = getLineWithMidpoints([
      [0, 0],
      [40, 0],
    ], 4)

    expect(lowCurvePath).toBe(getDefaultLine([
      [0, 0],
      [20, 0],
      [40, 0],
    ], curveCardinal.tension(1)))
    expect(highCurvePath).not.toBe(lowCurvePath)
  })
})
