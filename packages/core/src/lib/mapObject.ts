import type {
  ExtendedFeature,
  GeoGeometryObjects,
} from 'd3-geo'

export type MapObject = GeoGeometryObjects | ExtendedFeature

export type MapObjectEventType = 'mouseenter' | 'mouseleave' | 'mousedown' | 'mouseup'

/**
 * Supported interaction states for map objects.
 */
export const mapObjectState = ['default', 'hover', 'active'] as const
export type MapObjectState = typeof mapObjectState[number]
export type MapObjectStyles<TStyle> = Partial<Record<MapObjectState, TStyle>>

/**
 * Maps DOM event names to interaction state updates.
 */
export function getObjectStateUpdate(event: MapObjectEventType): MapObjectState {
  switch (event) {
    case 'mouseenter':
    case 'mouseup':
      return 'hover'
    case 'mouseleave':
      return 'default'
    case 'mousedown':
      return 'active'
    default:
      return 'default'
  }
}

/**
 * Resolves a style value for the current state (falls back to `default`).
 */
export function resolveObjectStyle<TStyle>(
  state: MapObjectState,
  styles?: MapObjectStyles<TStyle>,
): TStyle | undefined {
  return styles?.[state] ?? styles?.default
}
