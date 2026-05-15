import type { MapContext } from './map'
import type { MapObjectProps } from './mapObject'

export interface MapSphereProps<TStyle = unknown> extends MapObjectProps<TStyle> {
  fill?: string
  stroke?: string
}

export function renderSphere(context: MapContext): string | null {
  return context.path({ type: 'Sphere' })
}
