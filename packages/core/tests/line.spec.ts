import { describe, expect, it } from 'vitest'

import {
  curveBasis,
  curveNatural,
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

  it('uses midpoint rendering when midpoint is provided', () => {
    const path = getLinePath(undefined, {
      coordinates: [
        [0, 0],
        [40, 0],
      ],
      cartesian: true,
      midpoint: [0, -0.4],
    })

    expect(path).toMatch(/^M0,0C/)
    expect(path).not.toBe('M0,0L40,0')
  })

  it('uses curveNatural by default for custom and cartesian paths', () => {
    const coordinates: [number, number][] = [
      [0, 0],
      [20, 10],
      [40, 0],
    ]

    expect(getLinePath(undefined, {
      coordinates,
      cartesian: true,
    })).toBe(getLinePath(undefined, {
      coordinates,
      cartesian: true,
      curve: curveNatural,
    }))
  })
})

describe('createMidPoint', () => {
  it('creates a midpoint with segment-relative midpoint percentages', () => {
    expect(createMidPoint([
      [0, 0],
      [40, 20],
    ], [0.2, -0.5])).toEqual([
      18,
      34,
    ])
  })

  it('treats a positive perpendicular midpoint as the right-hand side of the segment', () => {
    expect(createMidPoint([
      [0, 0],
      [0, 100],
    ], [0, 1])).toEqual([100, 50])
  })
})

describe('getLineWithMidpoints', () => {
  it('renders a single midpoint segment', () => {
    const path = getLineWithMidpoints([
      [0, 0],
      [40, 0],
    ], curveNatural)

    expect(path).toMatch(/^M0,0C/)
    expect(path).not.toBe('M0,0L40,0')
  })

  it('inserts midpoints for multi-point paths', () => {
    const linearPath = getDefaultLine(THREE_POINT_COORDINATES)
    const midpointPath = getLineWithMidpoints(THREE_POINT_COORDINATES, curveNatural, [0, -0.2])

    expect(midpointPath).toMatch(/^M/)
    expect(midpointPath).not.toBe(linearPath)
  })
})
