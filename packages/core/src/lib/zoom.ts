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
  transition?: false | ZoomTransition
}

export interface SetupZoomOptions extends ApplyZoomOptions {
  center?: [number, number]
}

export interface ZoomTransition {
  duration?: number
  delay?: number
  ease?: (normalizedTime: number) => number
}

export interface ObjectZoomView {
  center: [number, number]
  zoom: number
}

export interface ObjectZoomViewOptions {
  minZoom?: number
  maxZoom?: number
  padding?: number
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
  const target = getZoomTarget(options.element, options.transition)

  if (!target) return

  if (options.center) {
    const zoom = options.zoom ?? ZOOM_DEFAULTS.zoom
    const extent = getBehaviorExtent(options.element, options.behavior)
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

    callWithTarget(target, options.behavior.transform, transform)
    return
  }

  callWithTarget(target, options.behavior.scaleTo, options.zoom ?? ZOOM_DEFAULTS.zoom)
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

function callWithTarget<Args extends unknown[]>(
  target: Selection<SVGSVGElement, unknown, null, undefined> | Transition<SVGSVGElement, unknown, null, undefined>,
  fn: (
    selection: Selection<SVGSVGElement, unknown, null, undefined> | Transition<SVGSVGElement, unknown, null, undefined>,
    ...args: Args
  ) => void,
  ...args: Args
): void {
  target.call(fn, ...args)
}

function getZoomTarget(
  element: ZoomTargetElement | null | undefined,
  transition?: false | ZoomTransition,
): Selection<SVGSVGElement, unknown, null, undefined> | Transition<SVGSVGElement, unknown, null, undefined> | undefined {
  const svgElement = getSvgElement(element)
  if (!svgElement) return undefined

  const selection = d3Select(svgElement)

  if (!transition) return selection

  let target = selection.transition()

  if (isNumber(transition.duration)) {
    target = target.duration(transition.duration)
  }
  if (isNumber(transition.delay)) {
    target = target.delay(transition.delay)
  }
  if (transition.ease) {
    target = target.ease(transition.ease)
  }

  return target
}

function getBehaviorExtent(
  element: ZoomTargetElement | null | undefined,
  behavior: DefaultZoomBehavior,
): [[number, number], [number, number]] {
  const svgElement = getSvgElement(element)
  const fallback: [[number, number], [number, number]] = [[0, 0], [0, 0]]

  if (!svgElement) return fallback

  const extent = behavior.extent()

  return extent.call(svgElement, (svgElement as SVGSVGElement & { __data__?: unknown }).__data__)
}

function getConstrainedZoomTransform(
  behavior: DefaultZoomBehavior,
  transform: ZoomTransform,
  extent: [[number, number], [number, number]],
): ZoomTransform {
  return behavior.constrain()(transform, extent, behavior.translateExtent())
}
