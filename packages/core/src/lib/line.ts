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

export type MapLineCoordinates = [number, number][]
export type MapLineCurve = CurveFactory | CurveFactoryLineOnly
export type MapLineMidpoint = [number, number]

export interface MapLineOptions {
  coordinates: MapLineCoordinates
  cartesian?: boolean
  custom?: boolean
  curve?: MapLineCurve
  midpoint?: MapLineMidpoint
}

export interface MapLineProps<TStyle = unknown> extends MapObjectProps<TStyle>, MapLineOptions {}

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

function getProjectedPoints(
  context: MapContext | undefined,
  coordinates: MapLineCoordinates,
): MapLineCoordinates {
  if (!context || coordinates.length < 2) return []

  return coordinates
    .map((coordinate) => context.projection(coordinate))
    .filter((point): point is [number, number] => point != null)
}

export function getDefaultLine(
  points: MapLineCoordinates,
  curve?: MapLineCurve,
): string | undefined {
  if (points.length < 2) return undefined

  const linePath = line<[number, number]>()

  if (curve) linePath.curve(curve)

  return linePath(points) ?? undefined
}

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

  if (length === 0) {
    return [midX, midY]
  }

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
