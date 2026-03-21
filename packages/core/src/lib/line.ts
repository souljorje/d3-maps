import type {
  CurveFactory,
  CurveFactoryLineOnly,
} from 'd3-shape'

import type { MapContext } from './map'
import type { MapObjectProps } from './mapObject'

import { curveLinear, line } from 'd3-shape'

import { isNumber } from './utils'

export type MapLineCoordinates = [number, number][]
export type MapLineCurve = CurveFactory | CurveFactoryLineOnly
export type MapLineCustomCurve = MapLineCurve | number

/**
 * Shared props contract for geographic line layers.
 */
export interface MapLineProps<TStyle = unknown> extends MapObjectProps<TStyle> {
  coordinates: MapLineCoordinates
  custom?: boolean
  curve?: MapLineCustomCurve
}

/**
 * Computes an SVG path for a geographic line between coordinates.
 *
 * Coordinates must be `[longitude, latitude]`.
 */
export function getLinePath(
  context: MapContext | undefined,
  coordinates: MapLineCoordinates,
  custom = false,
  curve?: MapLineCustomCurve,
): string | undefined {
  if (!custom) {
    return getLineStringPath(context, coordinates)
  }

  if (isNumber(curve)) {
    return getProjectedConnectorPath(context, coordinates, curve)
  }

  return getProjectedLinePath(context, coordinates, curve)
}

export function getLineStringPath(
  context: MapContext | undefined,
  coordinates: MapLineCoordinates,
): string | undefined {
  if (!context || coordinates.length < 2) return undefined

  return context.path({
    type: 'LineString',
    coordinates,
  }) ?? undefined
}

export function getProjectedLinePath(
  context: MapContext | undefined,
  coordinates: MapLineCoordinates,
  curve: MapLineCurve = curveLinear,
): string | undefined {
  const points = getProjectedPoints(context, coordinates)

  return getPointsLinePath(points, curve)
}

export function getProjectedConnectorPath(
  context: MapContext | undefined,
  coordinates: MapLineCoordinates,
  curve = 0.5,
): string | undefined {
  const points = getProjectedPoints(context, coordinates)

  return getConnectorLinePath(points, curve)
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

export function getPointsLinePath(
  points: MapLineCoordinates,
  curve: MapLineCurve = curveLinear,
): string | undefined {
  if (points.length < 2) return undefined

  return line<[number, number]>()
    .curve(curve)(points) ?? undefined
}

export function getConnectorLinePath(
  points: MapLineCoordinates,
  curve = 0.5,
): string | undefined {
  if (points.length < 2) return undefined

  const normalizedCurve = normalizeConnectorCurve(curve)
  const [startPoint, ...nextPoints] = points

  return nextPoints.reduce((path, endPoint, index) => {
    const start = points[index]
    const dx = start[0] - endPoint[0]
    const dy = start[1] - endPoint[1]
    const curveX = (dx / 2) * normalizedCurve
    const curveY = (dy / 2) * normalizedCurve
    const controlX = start[0] + (-dx / 2) - curveX
    const controlY = start[1] + (-dy / 2) + curveY

    return `${path}Q${controlX},${controlY} ${endPoint[0]},${endPoint[1]}`
  }, `M${startPoint[0]},${startPoint[1]}`)
}

function normalizeConnectorCurve(curve: number): number {
  if (!Number.isFinite(curve)) return 0.5

  return Math.min(1, Math.max(0, curve))
}
