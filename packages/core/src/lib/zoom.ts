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
import { zoom, zoomIdentity } from 'd3-zoom'

import {
  applyModifiers,
  isNumber,
} from './utils'

export type {
  D3ZoomEvent,
  ZoomBehavior,
  ZoomTransform,
} from 'd3-zoom'

export type Extent = [[number, number], [number, number]]
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
  center: [0, 0] as [number, number],
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

export interface SetupZoomOptions extends ApplyZoomOptions {}

export function createZoomBehavior(
  context?: MapContext,
  options: ZoomBehaviorOptions = {},
): DefaultZoomBehavior {
  const behavior = zoom<SVGSVGElement, unknown>()
  const minZoom = options.minZoom ?? ZOOM_DEFAULTS.minZoom
  const maxZoom = options.maxZoom ?? ZOOM_DEFAULTS.maxZoom
  const translateExtent: Extent = [[0, 0], [context?.width ?? 0, context?.height ?? 0]]
  behavior
    .scaleExtent([minZoom, maxZoom])
    .translateExtent(translateExtent)

  if (options.onZoomStart) {
    behavior.on('start', options.onZoomStart)
  }
  if (options.onZoom) {
    behavior.on('zoom', options.onZoom)
  }
  if (options.onZoomEnd) {
    behavior.on('end', options.onZoomEnd)
  }

  applyModifiers(behavior, options.config)

  return behavior
}

export function attachZoomBehavior(
  element: ZoomTargetElement | null | undefined,
  behavior: DefaultZoomBehavior,
): void {
  const svgElement = getSvgElement(element)
  if (!svgElement) return
  d3Select(svgElement).call(behavior)
}

export function applyZoomBehaviorTransform(
  element: ZoomTargetElement | null | undefined,
  behavior: DefaultZoomBehavior,
  transform: ZoomTransform,
): void {
  const svgElement = getSvgElement(element)
  if (!svgElement) return
  d3Select(svgElement).call(behavior.transform, transform)
}

export function applyZoomTransform(options: ApplyZoomOptions): void {
  const center = options.center ?? ZOOM_DEFAULTS.center
  const zoom = options.zoom ?? ZOOM_DEFAULTS.zoom
  applyZoomBehaviorTransform(
    options.element,
    options.behavior,
    zoomIdentity.translate(...center).scale(zoom),
  )
}

export function applyZoomGroupTransform(
  element: Element | null | undefined,
  transform: Pick<ZoomTransform, 'toString'> | null | undefined,
): void {
  if (!element || !transform) return
  element.setAttribute('transform', transform.toString())
}

export function setupZoom(options: SetupZoomOptions): void {
  attachZoomBehavior(options.element, options.behavior)
  applyZoomTransform(options)
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

function getSvgElement(element: ZoomTargetElement | null | undefined): SVGSVGElement | null {
  if (!element) return null
  if (element instanceof SVGSVGElement) return element
  return element.closest('svg')
}
