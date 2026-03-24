import type {
  CurveFactory,
  CurveFactoryLineOnly,
} from 'd3-shape'

import type { MapContext } from './map'
import type { MapObjectProps } from './mapObject'

import {
  curveNatural,
  line,
} from 'd3-shape'

/**
 * Geographic or cartesian line coordinates expressed as ordered `[x, y]` pairs
 */
export type MapLineCoordinates = [number, number][]

/**
 * D3 curve factory used by custom and cartesian line rendering
 */
export type MapLineCurve = CurveFactory | CurveFactoryLineOnly

/**
 * Midpoint adjustment expressed as percentages of the segment length
 *
 * - first value: moves the generated midpoint along the segment direction
 * - second value: moves the generated midpoint perpendicular to the segment direction
 */
export type MapLineMidpoint = [number, number]

/**
 * Core line rendering options shared by framework adapters
 */
export interface MapLineOptions {
  coordinates: MapLineCoordinates
  cartesian?: boolean
  custom?: boolean
  curve?: MapLineCurve
  midpoint?: MapLineMidpoint
}

/**
 * Public map line props including map object styling and interaction support
 */
export interface MapLineProps<TStyle = unknown> extends MapObjectProps<TStyle>, MapLineOptions {}

/**
 * Returns an SVG path string for a line in one of three modes:
 *
 * - geographic `LineString` rendering via `context.path(...)`
 * - projected custom rendering via `d3.line()`
 * - cartesian rendering for already-local coordinates
 */
export function getLinePath(
  context: MapContext | undefined,
  {
    coordinates,
    curve = curveNatural,
    custom = false,
    cartesian = false,
    midpoint,
  }: MapLineOptions,
): string | undefined {
  if (!cartesian && !custom) {
    if (!context || coordinates.length < 2) return undefined

    return context.path({
      type: 'LineString',
      coordinates,
    }) ?? undefined
  }

  const resolvedCoordinates = cartesian
    ? coordinates
    : getProjectedPoints(context, coordinates)

  if (midpoint && (midpoint[0] !== 0 || midpoint[1] !== 0)) {
    return getLineWithMidpoints(resolvedCoordinates, curve, midpoint)
  }

  return getDefaultLine(resolvedCoordinates, curve)
}

/**
 * Projects geographic coordinates into local `[x, y]` points using the active map projection
 */
function getProjectedPoints(
  context: MapContext | undefined,
  coordinates: MapLineCoordinates,
): MapLineCoordinates {
  if (!context || coordinates.length < 2) return []
  return coordinates
    .map((coordinate) => context.projection(coordinate))
    .filter((point): point is [number, number] => point != null)
}

/**
 * Builds a line path directly from local points using the provided D3 curve
 */
export function getDefaultLine(
  points: MapLineCoordinates,
  curve?: MapLineCurve,
): string | undefined {
  if (points.length < 2) return undefined
  const linePath = line<[number, number]>()
  if (curve) linePath.curve(curve)
  return linePath(points) ?? undefined
}

/**
 * Creates a generated midpoint for a segment and offsets it relative to the segment itself
 *
 * `midpoint` values are percentages of the full segment length
 */
export function createMidPoint(
  pointsPair: [[number, number], [number, number]],
  midpoint: MapLineMidpoint = [0, 0],
): [number, number] {
  const [[startX, startY], [endX, endY]] = pointsPair
  const [lengthwise, crosswise] = midpoint
  const midX = (startX + endX) / 2
  const midY = (startY + endY) / 2
  const dx = endX - startX
  const dy = endY - startY
  const length = Math.hypot(dx, dy)

  if (length === 0) return [midX, midY]

  const unitX = dx / length
  const unitY = dy / length
  const perpendicularX = unitY
  const perpendicularY = -unitX
  const offsetAlong = lengthwise / 100
  const offsetPerpendicular = crosswise / 100

  return [
    midX + (unitX * length * offsetAlong) + (perpendicularX * length * offsetPerpendicular),
    midY + (unitY * length * offsetAlong) + (perpendicularY * length * offsetPerpendicular),
  ]
}

/**
 * Inserts generated midpoints between consecutive points and renders the resulting path
 */
export function getLineWithMidpoints(
  points: MapLineCoordinates,
  curve?: MapLineCurve,
  midpoint?: MapLineMidpoint,
): string | undefined {
  if (points.length < 2) return undefined

  const pointsWithMidpoints = points.flatMap((point, index) => {
    if (index === 0) return [point]

    return [
      createMidPoint([points[index - 1], point], midpoint),
      point,
    ]
  })

  return getDefaultLine(pointsWithMidpoints, curve)
}
