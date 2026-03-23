import type {
  CurveFactory,
  CurveFactoryLineOnly,
} from 'd3-shape'

import type { MapContext } from './map'
import type { MapObjectProps } from './mapObject'

import {
  curveCardinal,
  line,
} from 'd3-shape'

import { isFunction, isNumber } from './utils'

export type MapLineCoordinates = [number, number][]
export type MapLineCurve = CurveFactory | CurveFactoryLineOnly | number
export type MapLineCurveOffset = [number, number]

export interface MapLineOptions {
  coordinates: MapLineCoordinates
  cartesian?: boolean
  custom?: boolean
  curve?: MapLineCurve
  curveOffset?: MapLineCurveOffset
}

export interface MapLineProps<TStyle = unknown> extends MapObjectProps<TStyle>, MapLineOptions {}

export function getLinePath(
  context: MapContext | undefined,
  {
    coordinates,
    curve,
    custom = false,
    cartesian = false,
    curveOffset,
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

  if (curveOffset && (curveOffset[0] !== 0 || curveOffset[1] !== 0)) {
    return getLineWithMidpoints(resolvedCoordinates, curve, curveOffset)
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

function resolveCurve(curve?: MapLineCurve): CurveFactory | CurveFactoryLineOnly | undefined {
  if (isFunction(curve)) return curve as CurveFactory | CurveFactoryLineOnly
  if (isNumber(curve)) {
    return curveCardinal.tension(1 - Math.min(1, Math.max(0, curve)))
  }
  return undefined
}

export function getDefaultLine(
  points: MapLineCoordinates,
  curve?: MapLineCurve,
): string | undefined {
  if (points.length < 2) return undefined

  const linePath = line<[number, number]>()
  const resolvedCurve = resolveCurve(curve)

  if (resolvedCurve) {
    linePath.curve(resolvedCurve)
  }

  return linePath(points) ?? undefined
}

export function createMidPoint(
  pointsPair: [[number, number], [number, number]],
  curveOffset: MapLineCurveOffset = [0, 0],
): [number, number] {
  const [[startX, startY], [endX, endY]] = pointsPair
  const [offsetAlong, offsetPerpendicular] = curveOffset
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

  return [
    midX + (unitX * length * offsetAlong) + (perpendicularX * length * offsetPerpendicular),
    midY + (unitY * length * offsetAlong) + (perpendicularY * length * offsetPerpendicular),
  ]
}

export function getLineWithMidpoints(
  points: MapLineCoordinates,
  curve: MapLineCurve = 0.5,
  curveOffset?: MapLineCurveOffset,
): string | undefined {
  if (points.length < 2) return undefined

  const pointsWithMidpoints = points.flatMap((point, index) => {
    if (index === 0) return [point]

    return [
      createMidPoint([points[index - 1], point], curveOffset),
      point,
    ]
  })

  return getDefaultLine(pointsWithMidpoints, curve)
}
