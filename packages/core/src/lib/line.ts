import type { MapContext } from './map'
import type { MapObject } from './mapObject'

export type MapLineCoordinates = [number, number][]

/**
 * Shared props contract for geographic line layers.
 */
export interface MapLineProps<TStyle = unknown> extends MapObject<TStyle> {
  coordinates: MapLineCoordinates
}

/**
 * Computes an SVG path for a geographic line between coordinates.
 *
 * Coordinates must be `[longitude, latitude]`.
 */
export function getLinePath(
  context: MapContext | undefined,
  coordinates: MapLineCoordinates,
): string | undefined {
  if (!context || coordinates.length < 2) return undefined

  const path = context.path({
    type: 'LineString',
    coordinates,
  })

  return path ?? undefined
}
