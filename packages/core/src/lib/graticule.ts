import type {
  GeoGraticuleGenerator,
} from 'd3-geo'

import type { MapContext } from './map'
import type { MapObjectProps } from './mapObject'
import type { MethodsToModifiers } from './utils'

import { geoGraticule } from 'd3-geo'

import { applyModifiers } from './utils'

/**
 * Extra graticule generator method calls to apply before rendering.
 *
 * Uses d3-geo `geoGraticule()` setter method names as keys.
 * Example: `{ step: [[10, 10]], precision: 2.5 }`
 *
 * @see https://d3js.org/d3-geo/shape#geoGraticule
 */
export interface GraticuleConfig extends MethodsToModifiers<GeoGraticuleGenerator> {}

/**
 * Shared props contract for graticule layers.
 */
export interface MapGraticuleProps<TStyle = unknown> extends MapObjectProps<TStyle> {
  config?: GraticuleConfig
  background?: boolean | string
  border?: boolean | string
}

export function renderGraticule(context: MapContext, config?: GraticuleConfig): string | null {
  const graticule = geoGraticule()
  applyModifiers(graticule, config)
  return context.path(graticule())
}

export function renderOutline(context: MapContext): string | null {
  return context.path({ type: 'Sphere' })
}
