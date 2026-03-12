import { describe, expect, it } from 'vitest'

import {
  curveBasis,
  line,
} from 'd3-shape'

import { getLinePath } from '../src'
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

  it('renders projected SVG line segments', () => {
    const context = makeTestMapContext()
    const projectedCoordinates = LINE_COORDINATES
      .map((coordinate) => context.projection(coordinate))
      .filter((coordinate): coordinate is [number, number] => coordinate != null)

    const path = getLinePath(context, LINE_COORDINATES)
    const expectedPath = line<[number, number]>()
      .x(([x]) => x)
      .y(([, y]) => y)(projectedCoordinates)

    expect(path).toBe(expectedPath)
  })

  it('renders geographic curves when curve mode is enabled', () => {
    const context = makeTestMapContext()

    const straightPath = getLinePath(context, LINE_COORDINATES)
    const curvedPath = getLinePath(context, LINE_COORDINATES, true)

    expect(curvedPath).not.toBe(straightPath)
  })

  it('uses a d3 line curve factory when provided', () => {
    const context = makeTestMapContext()
    const projectedCoordinates = THREE_POINT_COORDINATES
      .map((coordinate) => context.projection(coordinate))
      .filter((coordinate): coordinate is [number, number] => coordinate != null)

    const path = getLinePath(context, THREE_POINT_COORDINATES, curveBasis)
    const expectedPath = line<[number, number]>()
      .x(([x]) => x)
      .y(([, y]) => y)
      .curve(curveBasis)(projectedCoordinates)

    expect(path).toBe(expectedPath)
  })
})
