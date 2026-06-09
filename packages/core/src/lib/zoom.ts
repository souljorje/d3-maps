import type { GeoPermissibleObjects } from 'd3-geo'
import type {
  Selection,
} from 'd3-selection'
import type {
  SelectionOrTransition,
  Transition,
} from 'd3-transition'
import type {
  D3ZoomEvent,
  ZoomBehavior,
  ZoomTransform,
} from 'd3-zoom'

import type { MapContext } from './map'
import type {
  MaybeArray,
  MethodsToModifiers,
} from './utils'

import { select as d3Select } from 'd3-selection'
import {
  zoom,
  zoomIdentity,
  zoomTransform,
} from 'd3-zoom'

import {
  applyModifiers,
  clamp,
  ensureArray,
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

/**
 * Default D3 zoom behavior used by d3-maps.
 */
export interface DefaultZoomBehavior extends ZoomBehavior<SVGSVGElement, unknown> {}
type ZoomSelection = Selection<SVGSVGElement, unknown, null, undefined>
type DefaultZoomTransition = Transition<SVGSVGElement, unknown, null, undefined>
type ZoomSelectionOrTransition = SelectionOrTransition<SVGSVGElement, unknown, null, undefined>

type ZoomTransitionMethod =
  | 'attr'
  | 'attrTween'
  | 'delay'
  | 'duration'
  | 'ease'
  | 'easeVarying'
  | 'on'
  | 'style'
  | 'styleTween'
  | 'text'
  | 'textTween'
  | 'tween'

/**
 * Transition modifiers applied to one D3 transition step.
 */
export interface ZoomTransitionStep extends Pick<
  MethodsToModifiers<DefaultZoomTransition>,
  ZoomTransitionMethod
> {}

/**
 * D3 transition step or ordered transition steps used by programmatic zoom commands.
 */
export type ZoomTransition = MaybeArray<ZoomTransitionStep>

/**
 * Per-command transition override; `false` disables the default transition.
 */
export type ZoomTransitionParameter = false | ZoomTransition

export type ZoomCommandCallback<T> = (
  this: SVGSVGElement,
  event: any,
  d: unknown,
) => T

type NativeZoomMethodName =
  | 'transform'
  | 'translateBy'
  | 'translateTo'
  | 'scaleBy'
  | 'scaleTo'

export type ZoomPoint = readonly [number, number]
export type ZoomPointSource = null | ZoomPoint | ZoomCommandCallback<ZoomPoint>
export type ZoomNumberSource = number | ZoomCommandCallback<number>
export type ZoomTransformSource = ZoomTransform | ZoomCommandCallback<ZoomTransform>

/**
 * GeoJSON object that can be fitted by zoom commands.
 */
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

/**
 * Shared zoom configuration props.
 */
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
  minZoom: 1,
  maxZoom: 8,
}

type ZoomBehaviorMethod = (
  target: ZoomSelectionOrTransition,
  ...args: readonly unknown[]
) => void

/**
 * Programmatic zoom commands exposed by adapters and hooks.
 */
export interface ZoomCommands {
  /**
   * Applies a native D3 [transform](https://d3js.org/d3-zoom#zoom_transform)
   */
  transform: (
    transform: ZoomTransformSource,
    point?: ZoomPointSource,
    transition?: ZoomTransitionParameter,
  ) => void
  /**
   * Translates by x and y using D3 [translateBy](https://d3js.org/d3-zoom#zoom_translateBy)
   */
  translateBy: (
    x: ZoomNumberSource,
    y: ZoomNumberSource,
    transition?: ZoomTransitionParameter,
  ) => void
  /**
   * Translates to x and y using D3 [translateTo](https://d3js.org/d3-zoom#zoom_translateTo)
   */
  translateTo: (
    x: ZoomNumberSource,
    y: ZoomNumberSource,
    point?: ZoomPointSource,
    transition?: ZoomTransitionParameter,
  ) => void
  /**
   * Multiplies the current scale using D3 [scaleBy](https://d3js.org/d3-zoom#zoom_scaleBy)
   */
  scaleBy: (
    scale: ZoomNumberSource,
    point?: ZoomPointSource,
    transition?: ZoomTransitionParameter,
  ) => void
  /**
   * Applies an absolute scale using D3 [scaleTo](https://d3js.org/d3-zoom#zoom_scaleTo)
   */
  scaleTo: (
    scale: ZoomNumberSource,
    point?: ZoomPointSource,
    transition?: ZoomTransitionParameter,
  ) => void
  /**
   * Adds a delta to the current zoom scale, clamped to zoom limits.
   */
  scaleWith: (
    delta: number,
    point?: ZoomPointSource,
    transition?: ZoomTransitionParameter,
  ) => void
  /**
   * Fits a GeoJSON object in the viewport.
   */
  zoomToFeature: (
    feature: ZoomObject,
    options?: {
      padding?: ZoomFitOptions['padding']
      transition?: ZoomTransitionParameter
    },
  ) => boolean
  /**
   * Resets zoom to the identity transform.
   */
  reset: (transition?: ZoomTransitionParameter) => void
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

  const config: ZoomModifiers = {
    scaleExtent: [[minZoom, maxZoom]],
    ...options.config,
  }

  if (context && context.width && context.height) {
    Object.assign(config, {
      extent: [[[0, 0], [context.width, context.height]]],
      translateExtent: [[[0, 0], [context.width, context.height]]],
    })
  }
  applyModifiers(behavior, config)

  if (options.onZoomStart) behavior.on('start', options.onZoomStart)
  if (options.onZoom) behavior.on('zoom', options.onZoom)
  if (options.onZoomEnd) behavior.on('end', options.onZoomEnd)

  return behavior
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
export function setupZoom(options: {
  element: ZoomTargetElement | null | undefined
  behavior: DefaultZoomBehavior
}): void {
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
 * Creates framework-agnostic programmatic zoom commands.
 */
export function createZoomCommands(options: {
  element: () => ZoomTargetElement | null | undefined
  behavior: () => DefaultZoomBehavior
  context: () => Pick<MapContext, 'path' | 'width' | 'height'>
  minZoom: () => number
  maxZoom: () => number
  transition?: () => ZoomTransitionParameter | undefined
}): ZoomCommands {
  const getCommandState = (transition?: ZoomTransitionParameter): {
    element: ZoomTargetElement | null | undefined
    behavior: DefaultZoomBehavior
    transition?: ZoomTransitionParameter
  } => ({
    element: options.element(),
    behavior: options.behavior(),
    transition: transition ?? options.transition?.(),
  })
  const callCommand = (
    methodName: NativeZoomMethodName,
    args: readonly unknown[],
    transition?: ZoomTransitionParameter,
  ): void => {
    const state = getCommandState(transition)
    callZoomMethod(
      state.element,
      state.transition,
      state.behavior[methodName] as ZoomBehaviorMethod,
      args,
    )
  }
  return {
    transform: (
      transform,
      point,
      transition,
    ) => callCommand('transform', [transform, point], transition),
    translateBy: (
      x,
      y,
      transition,
    ) => callCommand('translateBy', [x, y], transition),
    translateTo: (
      x,
      y,
      point,
      transition,
    ) => callCommand('translateTo', [x, y, point], transition),
    scaleBy: (
      scale,
      point,
      transition,
    ) => callCommand('scaleBy', [scale, point], transition),
    scaleTo: (
      scale,
      point,
      transition,
    ) => callCommand('scaleTo', [scale, point], transition),
    scaleWith: (
      delta,
      point,
      transition,
    ) => {
      const command = getCommandState(transition)
      const currentTransform = getCurrentZoomTransform(command.element)
      const nextScale = clamp(
        currentTransform.k + delta,
        options.minZoom(),
        options.maxZoom(),
      )

      return callZoomMethod(
        command.element,
        command.transition,
        command.behavior.scaleTo as ZoomBehaviorMethod,
        [nextScale, point],
      )
    },
    zoomToFeature: (
      feature,
      commandOptions = {},
    ) => {
      const transform = getFeatureZoomTransform(
        options.context(),
        feature,
        {
          minZoom: options.minZoom(),
          maxZoom: options.maxZoom(),
          padding: commandOptions.padding,
        })

      if (!transform) return false

      callCommand('transform', [transform], commandOptions.transition)
      return true
    },
    reset: (transition) => callCommand('transform', [zoomIdentity], transition),
  }
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

function callZoomMethod(
  element: ZoomTargetElement | null | undefined,
  transition: ZoomTransitionParameter | undefined,
  method: ZoomBehaviorMethod,
  args: readonly unknown[],
): void {
  withSelection(element, (selection) => {
    withTransition(selection, transition).call(method, ...args)
  })
}

function withTransition(
  selection: ZoomSelection,
  transition?: ZoomTransitionParameter,
): ZoomSelectionOrTransition {
  if (!transition) return selection

  return applyZoomTransition(selection.transition(), transition)
}

function applyZoomTransition(
  initialTarget: DefaultZoomTransition,
  transition: ZoomTransition,
): DefaultZoomTransition {
  let target = initialTarget
  const steps = ensureArray(transition)
  steps.forEach((step, index) => {
    if (index > 0) target = target.transition()
    applyModifiers(target, step)
  })
  return target
}

function withSelection<T>(
  element: ZoomTargetElement | null | undefined,
  callback: (selection: ZoomSelection) => T,
): T | undefined {
  const svgElement = getSvgElement(element)
  if (!svgElement) return undefined

  return callback(d3Select(svgElement))
}
