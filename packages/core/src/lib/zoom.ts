import type { GeoPermissibleObjects } from 'd3-geo'
import type { Selection } from 'd3-selection'
import type { Transition } from 'd3-transition'
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
  zoomIdentity,
} from 'd3-zoom'

import {
  applyModifiers,
  getSvgElement,
  isNumber,
} from './utils'

import 'd3-transition'

export type {
  D3ZoomEvent,
  ZoomBehavior,
  ZoomTransform,
} from 'd3-zoom'

export interface DefaultZoomBehavior extends ZoomBehavior<SVGSVGElement, unknown> {}
export type ZoomObject = GeoPermissibleObjects

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
  transition?: ZoomTransition
  config?: ZoomModifiers
}

/**
 * D3 zoom event used by adapter components and hooks.
 */
export interface ZoomEvent extends D3ZoomEvent<SVGSVGElement, unknown> {};

/**
 * Zoom lifecycle callbacks forwarded from the underlying D3 zoom behavior.
 */
export interface ZoomEvents {
  onZoomStart?: (event: ZoomEvent) => void
  onZoom?: (event: ZoomEvent) => void
  onZoomEnd?: (event: ZoomEvent) => void
}

/**
 * Full zoom behavior configuration, including view props and event callbacks.
 */
export interface ZoomBehaviorOptions extends ZoomProps, ZoomEvents {}

/**
 * Value accepted by zoom-scale helpers.
 */
export type ZoomScaleSource = number | ZoomTransform | { transform: ZoomTransform }

/**
 * Root SVG element or zoomed group element associated with a zoom behavior.
 */
export type ZoomTargetElement = SVGSVGElement | SVGGElement

/**
 * Default zoom prop values used by the core helpers.
 */
export const ZOOM_DEFAULTS = {
  zoom: 1,
  minZoom: 1,
  maxZoom: 8,
}

/**
 * Options for applying a zoom transform to an existing zoom behavior.
 */
export interface ApplyZoomOptions {
  element: ZoomTargetElement | null | undefined
  behavior: DefaultZoomBehavior
  center?: [number, number]
  zoom?: number
  transition?: false | ZoomTransition
}

/**
 * Options for attaching a zoom behavior to an SVG element.
 */
export interface SetupZoomOptions
  extends Pick<ApplyZoomOptions, 'behavior' | 'element'> {}

/**
 * Transition settings for programmatic zoom updates.
 */
export interface ZoomTransition {
  duration?: number
  delay?: number
  ease?: (normalizedTime: number) => number
}

/**
 * Computed zoom target for an object fit operation.
 */
export interface ObjectZoomView {
  center: [number, number]
  zoom: number
}

/**
 * Options for fitting an object into the viewport.
 */
export interface ObjectZoomViewOptions {
  minZoom?: number
  maxZoom?: number
  padding?: number
}

/**
 * Creates a D3 zoom behavior configured for the current map viewport.
 */
export function createZoomBehavior(
  context?: Pick<MapContext, 'width' | 'height'>,
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

/**
 * Applies the current controlled zoom state to the target zoom behavior.
 */
export function applyZoom(options: ApplyZoomOptions): void {
  withZoomSelection(options.element, (selection) => {
    applyZoomWithTarget(selection, options)
  })
}

/**
 * Mirrors a D3 zoom transform onto the rendered zoom group element.
 */
export function applyZoomGroupTransform(
  element: Element | null | undefined,
  transform: Pick<ZoomTransform, 'toString'> | null | undefined,
): void {
  if (!element || !transform) return
  element.setAttribute('transform', transform.toString())
}

/**
 * Attaches a zoom behavior to the SVG element.
 */
export function setupZoom(options: SetupZoomOptions): void {
  withZoomSelection(options.element, (selection) => {
    selection.call(options.behavior)
  })
}

/**
 * Computes a centered zoom target that fits the given object inside the viewport.
 */
export function getObjectZoomView(
  context: Pick<MapContext, 'path' | 'width' | 'height'>,
  object: GeoPermissibleObjects,
  options: ObjectZoomViewOptions = {},
): ObjectZoomView | undefined {
  const { path, width, height } = context
  const minZoom = options.minZoom ?? ZOOM_DEFAULTS.minZoom
  const maxZoom = options.maxZoom ?? ZOOM_DEFAULTS.maxZoom
  const padding = options.padding ?? 0.1
  const [[x0, y0], [x1, y1]] = path.bounds(object)
  const boundsWidth = x1 - x0
  const boundsHeight = y1 - y0

  if (!Number.isFinite(boundsWidth) || !Number.isFinite(boundsHeight) || boundsWidth <= 0 || boundsHeight <= 0) {
    return undefined
  }

  return {
    center: [
      (x0 + x1) / 2,
      (y0 + y1) / 2,
    ],
    zoom: Math.min(
      maxZoom,
      Math.max(
        minZoom,
        (1 - padding) / Math.max(boundsWidth / width, boundsHeight / height),
      ),
    ),
  }
}

/**
 * Returns the projected map-space point currently centered in the viewport.
 */
export function getZoomViewportCenter(
  context: Pick<MapContext, 'width' | 'height'>,
  transform: Pick<ZoomTransform, 'invert'>,
): [number, number] {
  return transform.invert([
    context.width / 2,
    context.height / 2,
  ])
}

/**
 * Reads a zoom scale from a number, transform, or zoom event-like object.
 */
export function getZoomScale(source: ZoomScaleSource): number {
  if (isNumber(source)) return source
  if (isZoomTransform(source)) return source.k
  return source?.transform?.k ?? 1
}

/**
 * Returns the inverse zoom scale, with a safe fallback for invalid or zero values.
 */
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

function applyZoomWithTarget(
  selection: Selection<SVGSVGElement, unknown, null, undefined>,
  options: ApplyZoomOptions,
): void {
  const target = getTransitionTarget(selection, options.transition)

  if (!options.center) {
    target.call(options.behavior.scaleTo, options.zoom ?? ZOOM_DEFAULTS.zoom)
    return
  }

  const zoom = options.zoom ?? ZOOM_DEFAULTS.zoom
  const extent = getBehaviorExtent(selection, options.behavior)
  const transform = getConstrainedZoomTransform(
    options.behavior,
    zoomIdentity
      .translate(
        (extent[0][0] + extent[1][0]) / 2,
        (extent[0][1] + extent[1][1]) / 2,
      )
      .scale(zoom)
      .translate(-options.center[0], -options.center[1]),
    extent,
  )

  target.call(options.behavior.transform, transform)
}

function getTransitionTarget(
  selection: Selection<SVGSVGElement, unknown, null, undefined>,
  transition?: false | ZoomTransition,
): Selection<SVGSVGElement, unknown, null, undefined> | Transition<SVGSVGElement, unknown, null, undefined> {
  if (!transition) return selection

  const target = selection.transition()
  if (isNumber(transition.duration)) target.duration(transition.duration)
  if (isNumber(transition.delay)) target.delay(transition.delay)
  if (transition.ease) target.ease(transition.ease)
  return target
}

function withZoomSelection<T>(
  element: ZoomTargetElement | null | undefined,
  run: (selection: Selection<SVGSVGElement, unknown, null, undefined>) => T,
): T | undefined {
  const svgElement = getSvgElement(element)
  if (!svgElement) return undefined

  return run(d3Select(svgElement))
}

function getBehaviorExtent(
  selection: Selection<SVGSVGElement, unknown, null, undefined>,
  behavior: DefaultZoomBehavior,
): [[number, number], [number, number]] {
  const svgElement = selection.node()
  if (!svgElement) return [[0, 0], [0, 0]]

  const extent = behavior.extent()

  return extent.call(svgElement, selection.datum())
}

function getConstrainedZoomTransform(
  behavior: DefaultZoomBehavior,
  transform: ZoomTransform,
  extent: [[number, number], [number, number]],
): ZoomTransform {
  return behavior.constrain()(transform, extent, behavior.translateExtent())
}
