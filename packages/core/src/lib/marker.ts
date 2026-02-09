import type { MapContext } from './map'
import type { MapObjectStyles } from './mapObject'

export type MapMarkerCoordinates = [number, number]

export interface MapMarkerProps<TStyle = unknown> {
  coordinates?: MapMarkerCoordinates
  styles?: MapObjectStyles<TStyle>
}

export function getMarkerTransform(
  context: MapContext | undefined,
  coordinates: MapMarkerCoordinates,
  fallback = 'translate(0, 0)',
): string {
  const projection = context?.projection
  if (!projection) return fallback

  const projected = projection(coordinates)
  if (!projected) return fallback

  const [x, y] = projected
  return `translate(${x}, ${y})`
}
