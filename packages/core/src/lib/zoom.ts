import type {
  D3ZoomEvent,
  ZoomBehavior,
  ZoomTransform,
} from 'd3-zoom'

import type { MapContext } from './map'

import { select as d3Select } from 'd3-selection'
import { zoom, zoomIdentity } from 'd3-zoom'

import { isNumber } from './utils'

export type {
  D3ZoomEvent,
  ZoomBehavior,
  ZoomTransform,
} from 'd3-zoom'

export type Extent = [[number, number], [number, number]]

export interface ZoomConfigOptions {
  minZoom?: number
  maxZoom?: number
  translateExtent?: Extent
}

export interface ZoomConfig {
  scaleExtent: [number, number]
  translateExtent: Extent
}

export type ZoomBehaviorMethodName<TElement extends Element, TDatum> = Extract<{
  [K in keyof ZoomBehavior<TElement, TDatum>]:
  ZoomBehavior<TElement, TDatum>[K] extends (...args: unknown[]) => unknown
    ? K
    : never
}[keyof ZoomBehavior<TElement, TDatum>], string>

export type ZoomBehaviorMethodArgs<
  TElement extends Element,
  TDatum,
  TMethod extends ZoomBehaviorMethodName<TElement, TDatum>,
> = ZoomBehavior<TElement, TDatum>[TMethod] extends (...args: infer TArgs) => unknown
  ? TArgs
  : never

export type ZoomBehaviorSingleArg<
  TElement extends Element,
  TDatum,
  TMethod extends ZoomBehaviorMethodName<TElement, TDatum>,
> = ZoomBehaviorMethodArgs<TElement, TDatum, TMethod> extends [infer TArg]
  ? TArg
  : never

export type ZoomModifierValue<
  TElement extends Element,
  TDatum,
  TMethod extends ZoomBehaviorMethodName<TElement, TDatum>,
> =
  | ZoomBehaviorMethodArgs<TElement, TDatum, TMethod>
  | ZoomBehaviorSingleArg<TElement, TDatum, TMethod>

export type ZoomModifiers<TElement extends Element = SVGSVGElement, TDatum = unknown> = Partial<{
  [K in ZoomBehaviorMethodName<TElement, TDatum>]: ZoomModifierValue<TElement, TDatum, K>
}>

export interface ZoomProps<TElement extends Element = SVGSVGElement, TDatum = unknown> {
  center?: [number, number]
  zoom?: number
  minZoom?: number
  maxZoom?: number
  translateExtent?: Extent
  modifiers?: ZoomModifiers<TElement, TDatum>
}

export interface ZoomEvent extends D3ZoomEvent<SVGSVGElement, unknown> {};

export interface ZoomEvents {
  onZoomStart?: (event: ZoomEvent) => void
  onZoom?: (event: ZoomEvent) => void
  onZoomEnd?: (event: ZoomEvent) => void
}

export interface ZoomBehaviorOptions<TElement extends Element = SVGSVGElement, TDatum = unknown>
  extends ZoomProps<TElement, TDatum>, ZoomEvents {}

export type ZoomScaleSource = number | ZoomTransform | { transform: ZoomTransform }
export type ZoomTargetElement = SVGSVGElement | SVGGElement

export const ZOOM_DEFAULTS = {
  center: [0, 0] as [number, number],
  zoom: 1,
  minZoom: 1,
  maxZoom: 8,
  extent: [[0, 0], [0, 0]] as Extent,
}

export interface ApplyZoomOptions {
  element: ZoomTargetElement | null | undefined
  behavior: ZoomBehavior<SVGSVGElement, unknown>
  center?: [number, number]
  zoom?: number
}

export interface SetupZoomOptions extends ApplyZoomOptions {}

export function getDefaultTranslateExtent(context?: MapContext): Extent {
  return [[0, 0], [context?.width ?? 0, context?.height ?? 0]]
}

export function createZoomTransform(center: [number, number], zoomLevel: number): ZoomTransform {
  return zoomIdentity.translate(...center).scale(zoomLevel)
}

export function createZoomConfig(options: ZoomConfigOptions): ZoomConfig {
  const minZoom = options.minZoom ?? ZOOM_DEFAULTS.minZoom
  const maxZoom = options.maxZoom ?? ZOOM_DEFAULTS.maxZoom

  return {
    scaleExtent: [minZoom, maxZoom],
    translateExtent: options.translateExtent ?? ZOOM_DEFAULTS.extent,
  }
}

export function createZoomBehavior<TElement extends Element = SVGSVGElement, TDatum = unknown>(
  context?: MapContext,
  options: ZoomBehaviorOptions<TElement, TDatum> = {},
): ZoomBehavior<TElement, TDatum> {
  const behavior = zoom<TElement, TDatum>()

  const config = createZoomConfig({
    minZoom: options.minZoom,
    maxZoom: options.maxZoom,
    translateExtent: options.translateExtent ?? getDefaultTranslateExtent(context),
  })
  behavior
    .scaleExtent(config.scaleExtent)
    .translateExtent(config.translateExtent)

  if (options.onZoomStart) {
    behavior.on('start', options.onZoomStart)
  }
  if (options.onZoom) {
    behavior.on('zoom', options.onZoom)
  }
  if (options.onZoomEnd) {
    behavior.on('end', options.onZoomEnd)
  }

  // Modifiers are applied last so user-level d3-zoom config can override convenience props.
  applyZoomModifiers(behavior, options.modifiers)

  return behavior
}

export function attachZoomBehavior(
  element: ZoomTargetElement | null | undefined,
  behavior: ZoomBehavior<SVGSVGElement, unknown>,
): void {
  const svgElement = getSvgElement(element)
  if (!svgElement) return
  d3Select(svgElement).call(behavior)
}

export function applyZoomBehaviorTransform(
  element: ZoomTargetElement | null | undefined,
  behavior: ZoomBehavior<SVGSVGElement, unknown>,
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
    createZoomTransform(center, zoom),
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

function applyZoomModifiers<TElement extends Element, TDatum>(
  behavior: ZoomBehavior<TElement, TDatum>,
  modifiers?: ZoomModifiers<TElement, TDatum>,
): void {
  if (!modifiers) return

  for (const [methodName, methodArgs] of Object.entries(modifiers)) {
    if (!methodName || methodArgs === undefined) continue

    const modifier = behavior[methodName as ZoomBehaviorMethodName<TElement, TDatum>]
    if (typeof modifier !== 'function') continue

    const normalizedArgs = Array.isArray(methodArgs) ? methodArgs : [methodArgs]
    ;(modifier as (...args: unknown[]) => unknown).apply(behavior, normalizedArgs)
  }
}

function getSvgElement(element: ZoomTargetElement | null | undefined): SVGSVGElement | null {
  if (!element) return null
  if (element instanceof SVGSVGElement) return element
  return element.closest('svg')
}
