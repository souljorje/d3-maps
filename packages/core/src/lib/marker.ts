import type { MapContext } from './map'
import type { MapObjectProps } from './mapObject'

import { makeTransform } from './utils'

export type MapMarkerCoordinates = [number, number]

/**
 * Shared props contract for marker layers.
 */
export interface MapMarkerProps<TStyle = unknown> extends MapObjectProps<TStyle> {
  coordinates: MapMarkerCoordinates
}

/**
 * Computes an SVG transform (`translate(x, y)`) for the given coordinates using the active projection.
 *
 * Coordinates must be `[longitude, latitude]`.
 */
export function getMarkerTransform(
  context: MapContext | undefined,
  coordinates: MapMarkerCoordinates,
): string | undefined {
  const projected = context?.projection(coordinates)
  if (!projected) return undefined
  return makeTransform(...projected)
}
