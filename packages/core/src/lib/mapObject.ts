import type { Feature, Point } from 'geojson'

export type MapObject = Point | Feature

export type MapObjectFocusEventType = 'focus' | 'blur'
export type MapObjectMouseEventType = 'mouseenter' | 'mouseleave' | 'mousedown' | 'mouseup'
export type MapObjectEventType = MapObjectFocusEventType | MapObjectMouseEventType
export type MapObjectEvent<E> = E extends MapObjectFocusEventType ? FocusEvent : MouseEvent;

export const mapObjectState = ['default', 'hover', 'active'] as const
export type MapObjectState = typeof mapObjectState[number]
export type MapObjectStyles<TStyle> = Partial<Record<MapObjectState, TStyle>>

export function getObjectStateUpdate(event: MapObjectEventType): MapObjectState {
  switch (event) {
    case 'focus':
    case 'mouseenter':
    case 'mouseup':
      return 'hover'
    case 'blur':
    case 'mouseleave':
      return 'default'
    case 'mousedown':
      return 'active'
    default:
      return 'default'
  }
}

export function resolveObjectStyle<TStyle>(
  state: MapObjectState,
  styles?: MapObjectStyles<TStyle>,
): TStyle | undefined {
  return styles?.[state] ?? styles?.default
}
