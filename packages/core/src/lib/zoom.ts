import type { GeoPermissibleObjects } from 'd3-geo'
import type { Selection } from 'd3-selection'
import type { Transition } from 'd3-transition'
import type {
  D3ZoomEvent,
  ZoomBehavior,
  ZoomTransform,
} from 'd3-zoom'

import type { MapContext } from './map'
import type { MethodsToModifiers } from './utils'

import { select as d3Select } from 'd3-selection'
import {
  zoom,
  zoomIdentity,
  zoomTransform,
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

export {
  zoomIdentity,
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

// export interface TransitionModifiers extends MethodsToModifiers<Transition> {}

export interface ZoomProps {
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
 * Full zoom behavior configuration, including event callbacks.
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
 * Options for applying a native D3 zoom transform to an existing zoom behavior.
 */
export interface ApplyZoomTransformOptions {
  element: ZoomTargetElement | null | undefined
  behavior: DefaultZoomBehavior
  transform: ZoomTransform
  transition?: false | ZoomTransition
}

/**
 * Options for applying a relative zoom scale.
 */
export interface ScaleByOptions {
  element: ZoomTargetElement | null | undefined
  behavior: DefaultZoomBehavior
  factor: number
  transition?: false | ZoomTransition
}

/**
 * Options for applying an absolute zoom scale.
 */
export interface ScaleToOptions {
  element: ZoomTargetElement | null | undefined
  behavior: DefaultZoomBehavior
  scale: number
  transition?: false | ZoomTransition
}

type ZoomCallTarget =
  | Selection<SVGSVGElement, unknown, null, undefined>
  | Transition<SVGSVGElement, unknown, null, undefined>

interface ZoomCallOptions {
  element: ZoomTargetElement | null | undefined
  transition?: false | ZoomTransition
}

/**
 * Options for attaching a zoom behavior to an SVG element.
 */
export interface SetupZoomOptions
  extends Pick<ApplyZoomTransformOptions, 'behavior' | 'element'> {}

/**
 * Transition settings for programmatic zoom updates.
 */
export interface ZoomTransition {
  duration?: number
  delay?: number
  ease?: (normalizedTime: number) => number
}

/**
 * Options for computing or applying a fit operation.
 */
export interface ZoomFitOptions {
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
    extent: [[[0, 0], [context?.width ?? 0, context?.height ?? 0]]],
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

// zoom.transform(selection, transform, point)
// zoom.translateBy(selection, x, y)
// zoom.translateTo(selection, x, y, p)
// zoom.scaleBy(selection, k, p)
// zoom.scaleTo(selection, k, p)

/**
 * Applies a native D3 zoom transform to the target zoom behavior.
 */
export function applyZoomTransform(options: ApplyZoomTransformOptions): void {
  callZoom(options, (target) => {
    target.call(options.behavior.transform, options.transform)
  })
}

/**
 * Applies a relative zoom scale through D3 zoom's scaleBy.
 */
export function scaleBy(options: ScaleByOptions): void {
  callZoom(options, (target) => {
    target.call(options.behavior.scaleBy, options.factor)
  })
}

/**
 * Applies an absolute zoom scale through D3 zoom's scaleTo.
 */
export function scaleTo(options: ScaleToOptions): void {
  callZoom(options, (target) => {
    target.call(options.behavior.scaleTo, options.scale)
  })
}

/**
 * Mirrors a D3 zoom event transform onto the rendered zoom group element.
 */
export function applyZoomEventTransform(
  element: Element | null | undefined,
  event: Pick<ZoomEvent, 'transform'>,
): void {
  if (!element || !event.transform) return
  element.setAttribute('transform', event.transform.toString())
}

/**
 * Attaches a zoom behavior to the SVG element.
 */
export function setupZoom(options: SetupZoomOptions): void {
  withSelection(options.element, (selection) => {
    selection.call(options.behavior)
  })
}

function getBoundsZoomTransform(
  context: Pick<MapContext, 'width' | 'height'>,
  bounds: [[number, number], [number, number]],
  options: ZoomFitOptions = {},
): ZoomTransform | undefined {
  const { width, height } = context
  const minZoom = options.minZoom ?? ZOOM_DEFAULTS.minZoom
  const maxZoom = options.maxZoom ?? ZOOM_DEFAULTS.maxZoom
  const padding = options.padding ?? 0
  const [[x0, y0], [x1, y1]] = bounds
  const boundsWidth = x1 - x0
  const boundsHeight = y1 - y0
  const availableWidth = Math.max(1, width - padding * 2)
  const availableHeight = Math.max(1, height - padding * 2)

  if (!Number.isFinite(boundsWidth) || !Number.isFinite(boundsHeight) || boundsWidth <= 0 || boundsHeight <= 0) {
    return undefined
  }

  const scaleX = availableWidth / boundsWidth
  const scaleY = availableHeight / boundsHeight
  const zoom = Math.min(maxZoom, Math.max(minZoom, Math.min(scaleX, scaleY)))

  return zoomIdentity
    .translate(width / 2, height / 2)
    .scale(zoom)
    .translate(
      -(x0 + x1) / 2,
      -(y0 + y1) / 2,
    )
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
 * Reads the current D3 zoom transform from the map SVG.
 */
export function getCurrentZoomTransform(
  element: ZoomTargetElement | null | undefined,
): ZoomTransform {
  const svgElement = getSvgElement(element)
  return svgElement ? zoomTransform(svgElement) : zoomIdentity
}

/**
 * Returns the transform that fits a GeoJSON object in the viewport.
 */
export function getFeatureZoomTransform(
  context: Pick<MapContext, 'path' | 'width' | 'height'>,
  feature: ZoomObject,
  options: ZoomFitOptions = {},
): ZoomTransform | undefined {
  return getBoundsZoomTransform(
    context,
    context.path.bounds(feature),
    options,
  )
}

/**
 * Returns whether D3 emitted the zoom event from a programmatic zoom call.
 */
export function isProgrammaticZoomEvent(event: Pick<ZoomEvent, 'sourceEvent'>): boolean {
  return event.sourceEvent == null
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

export function callZoom(
  options: ZoomCallOptions,
  callback: (target: ZoomCallTarget) => void,
): void {
  return withSelection(options.element, (selection) => {
    callback(withTransition(selection, options.transition))
  })
}

function withTransition(
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

function withSelection<T>(
  element: ZoomTargetElement | null | undefined,
  callback: (selection: Selection<SVGSVGElement, unknown, null, undefined>) => T,
): T | undefined {
  const svgElement = getSvgElement(element)
  if (!svgElement) return undefined

  return callback(d3Select(svgElement))
}
