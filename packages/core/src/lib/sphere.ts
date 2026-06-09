import type { MapContext } from './map'

export interface MapSphereProps {
  /**
   * Whether to disable clipping child content to the sphere path.
   *
   * @defaultValue false
   */
  noClip?: boolean
  /**
   * SVG fill for the background sphere path.
   */
  fill?: string
  /**
   * SVG stroke for the border sphere path.
   */
  stroke?: string
}

export function renderSphere(context: MapContext): string | null {
  return context.path({ type: 'Sphere' })
}
