import type {
  CurveFactory,
  CurveFactoryLineOnly,
} from 'd3-shape'

import type { MapContext } from './map'
import type { MapObject } from './mapObject'

import { line } from 'd3-shape'

import { isFunction } from './utils'

export type MapLineCoordinates = [number, number]
export type MapLineCurve = boolean | CurveFactory | CurveFactoryLineOnly

/**
 * Shared props contract for straight line layers.
 */
export interface MapLineProps<TStyle = unknown> extends MapObject<TStyle> {
  coordinates?: MapLineCoordinates[]
  curve?: MapLineCurve
}

function isCurveFactory(curve: MapLineCurve): curve is CurveFactory | CurveFactoryLineOnly {
  return isFunction(curve)
}

/**
 * Computes an SVG path for a straight projected line between geographic coordinates.
 *
 * Coordinates must be `[longitude, latitude]`.
 */
export function getLinePath(
  context: MapContext | undefined,
  coordinates: MapLineCoordinates[],
  curve: MapLineCurve = false,
): string | undefined {
  if (!context || coordinates.length < 2) return undefined

  if (curve === true) {
    const path = context.path({
      type: 'LineString',
      coordinates,
    })

    return path ?? undefined
  }

  const projectedCoordinates = coordinates
    .map((coordinate) => context.projection?.(coordinate))
    .filter((coordinate): coordinate is [number, number] => coordinate != null)

  if (projectedCoordinates.length < 2) return undefined

  const linePath = line<[number, number]>()
    .x(([x]) => x)
    .y(([, y]) => y)

  if (isCurveFactory(curve)) {
    linePath.curve(curve)
  }

  return linePath(projectedCoordinates) ?? undefined
}
