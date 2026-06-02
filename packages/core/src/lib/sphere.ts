import type { MapContext } from './map'

export interface MapSphereProps {
  fill?: string
  stroke?: string
}

export function renderSphere(context: MapContext): string | null {
  return context.path({ type: 'Sphere' })
}
