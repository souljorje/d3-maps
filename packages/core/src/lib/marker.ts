import type { MapContext } from './map'
import type { MapObjectStyles } from './mapObject'

import { makeTransform } from './utils'

export type MapMarkerCoordinates = [number, number]

/**
 * Shared props contract for marker layers.
 */
export interface MapMarkerProps<TStyle = unknown> {
  coordinates?: MapMarkerCoordinates
  styles?: MapObjectStyles<TStyle>
}

/**
 * Computes an SVG transform (`translate(x, y)`) for the given coordinates using the active projection.
 *
 * Coordinates must be `[longitude, latitude]`.
 */
export function getMarkerTransform(
  context: MapContext | undefined,
  coordinates: MapMarkerCoordinates,
  fallback = 'translate(0, 0)',
): string {
  const projection = context?.projection
  if (!projection) return fallback

  const projected = projection(coordinates)
  if (!projected) return fallback

  return makeTransform(...projected)
}
