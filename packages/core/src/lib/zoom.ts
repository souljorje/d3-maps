import type { Selection } from 'd3-selection'
import type {
  D3ZoomEvent,
  ZoomBehavior,
  ZoomTransform,
} from 'd3-zoom'

import type { MapContext } from './map'
import type {
  MethodsToModifiers,
} from './utils'

import { select as d3Select } from 'd3-selection'
import {
  zoom,
} from 'd3-zoom'

import {
  applyModifiers,
  getSvgElement,
  isNumber,
} from './utils'

export type {
  D3ZoomEvent,
  ZoomBehavior,
  ZoomTransform,
} from 'd3-zoom'

export interface DefaultZoomBehavior extends ZoomBehavior<SVGSVGElement, unknown> {}

/**
 * Extra zoom method calls to apply before rendering.
 *
 * Use zoom method names as keys and method arguments as values.
 * Example: `{ scaleExtent: [[2, 9]], translateExtent: [[[0, 0], [10, 10]]] }`
 *
 * @see https://d3js.org/d3-zoom
 */
export interface ZoomModifiers extends MethodsToModifiers<DefaultZoomBehavior> {}

export interface ZoomProps {
  /**
   * Projected map-space point to keep centered in the viewport.
   *
   * If omitted, changing `zoom` alone preserves the current viewport center.
   */
  center?: [number, number]
  zoom?: number
  minZoom?: number
  maxZoom?: number
  config?: ZoomModifiers
}

export interface ZoomEvent extends D3ZoomEvent<SVGSVGElement, unknown> {};

export interface ZoomEvents {
  onZoomStart?: (event: ZoomEvent) => void
  onZoom?: (event: ZoomEvent) => void
  onZoomEnd?: (event: ZoomEvent) => void
}

export interface ZoomBehaviorOptions extends ZoomProps, ZoomEvents {}

export type ZoomScaleSource = number | ZoomTransform | { transform: ZoomTransform }
export type ZoomTargetElement = SVGSVGElement | SVGGElement

export const ZOOM_DEFAULTS = {
  zoom: 1,
  minZoom: 1,
  maxZoom: 8,
}

export interface ApplyZoomOptions {
  element: ZoomTargetElement | null | undefined
  behavior: DefaultZoomBehavior
  center?: [number, number]
  zoom?: number
}

export interface SetupZoomOptions extends ApplyZoomOptions {
  center?: [number, number]
}

export function createZoomBehavior(
  context?: MapContext,
  options: ZoomBehaviorOptions = {},
): DefaultZoomBehavior {
  const behavior = zoom<SVGSVGElement, unknown>()
  const minZoom = options.minZoom ?? ZOOM_DEFAULTS.minZoom
  const maxZoom = options.maxZoom ?? ZOOM_DEFAULTS.maxZoom

  applyModifiers(behavior, {
    scaleExtent: [[minZoom, maxZoom]],
    translateExtent: [[[0, 0], [context?.width ?? 0, context?.height ?? 0]]],
    ...options.config,
  })

  if (options.onZoomStart) {
    behavior.on('start', options.onZoomStart)
  }
  if (options.onZoom) {
    behavior.on('zoom', options.onZoom)
  }
  if (options.onZoomEnd) {
    behavior.on('end', options.onZoomEnd)
  }

  return behavior
}

export function applyZoom(options: ApplyZoomOptions): void {
  if (options.center) {
    callWithSvg(options.element, options.behavior.scaleTo, options.zoom ?? ZOOM_DEFAULTS.zoom)
    callWithSvg(options.element, options.behavior.translateTo, ...options.center)
    return
  }

  callWithSvg(options.element, options.behavior.scaleTo, options.zoom ?? ZOOM_DEFAULTS.zoom)
}

export function applyZoomGroupTransform(
  element: Element | null | undefined,
  transform: Pick<ZoomTransform, 'toString'> | null | undefined,
): void {
  if (!element || !transform) return
  element.setAttribute('transform', transform.toString())
}

export function setupZoom(options: SetupZoomOptions): void {
  callWithSvg(options.element, options.behavior)
  applyZoom(options)
}

export function getZoomScale(source: ZoomScaleSource): number {
  if (isNumber(source)) return source
  if (isZoomTransform(source)) return source.k
  return source?.transform?.k ?? 1
}

export function getInverseZoomScale(
  source: ZoomScaleSource,
  fallback: number = 1,
): number {
  const scale = getZoomScale(source)
  if (!isNumber(scale) || scale === 0) return fallback
  return 1 / scale
}

function isZoomTransform(value: unknown): value is ZoomTransform {
  return Boolean(
    value
    && isNumber((value as ZoomTransform).k)
    && isNumber((value as ZoomTransform).x)
    && isNumber((value as ZoomTransform).y),
  )
}

function callWithSvg<Args extends unknown[]>(
  element: ZoomTargetElement | null | undefined,
  fn: (selection: Selection<SVGSVGElement, unknown, null, undefined>, ...args: Args) => void,
  ...args: Args
): void {
  const svgElement = getSvgElement(element)
  if (!svgElement) return
  d3Select(svgElement).call(fn, ...args)
}
