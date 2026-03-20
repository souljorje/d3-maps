import type {
  CurveFactory,
  CurveFactoryLineOnly,
} from 'd3-shape'

import type { MapContext } from './map'
import type { MapObjectProps } from './mapObject'

import { curveLinear, line } from 'd3-shape'

export type MapLineCoordinates = [number, number][]
export type MapLineCurve = CurveFactory | CurveFactoryLineOnly

/**
 * Shared props contract for geographic line layers.
 */
export interface MapLineProps<TStyle = unknown> extends MapObjectProps<TStyle> {
  coordinates: MapLineCoordinates
  custom?: boolean
  curve?: MapLineCurve
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
  curve?: MapLineCurve,
): string | undefined {
  if (!context || coordinates.length < 2) return undefined
  if (custom) {
    return getCustomLinePath(context, coordinates, curve)
  }

  const path = context.path({
    type: 'LineString',
    coordinates,
  })

  return path ?? undefined
}

function getCustomLinePath(
  context: MapContext,
  coordinates: MapLineCoordinates,
  curve?: MapLineCurve,
): string | undefined {
  const projection = context.projection

  const points = coordinates
    .map((coordinate) => projection(coordinate))
    .filter((point): point is [number, number] => point != null)

  return getPointsLinePath(points, curve)
}

export function getPointsLinePath(
  points: MapLineCoordinates,
  curve: MapLineCurve = curveLinear,
): string | undefined {
  return line<[number, number]>()
    .curve(curve)(points) ?? undefined
}
