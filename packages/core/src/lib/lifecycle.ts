import type { InteractionState } from './interaction'
import type { MapContext } from './map'
import type { DefaultZoomBehavior, ZoomBehaviorOptions, ZoomCommands } from './zoom'

import { dragEnable } from 'd3-drag'
import { select } from 'd3-selection'

import { useInteractionEvents } from './interaction'
import { getSvgElement } from './utils'
import {
  applyZoomEventTransform,
  createZoomBehavior,
  createZoomCommands,
  createZoomCommandsProxy,
  getCurrentZoomTransform,
  setupZoom,
  ZOOM_DEFAULTS,
} from './zoom'

const zoomOwners = new WeakMap<SVGSVGElement, () => void>()

/** Attaches shared interaction behavior to an already-mounted element. */
export function bindMapInteraction(
  element: Element,
  onStateChange: (state: InteractionState) => void,
  shouldRecoverOnGlobalMouseup = false,
): () => void {
  const controller = useInteractionEvents(onStateChange, shouldRecoverOnGlobalMouseup)
  const listeners: [string, EventListener][] = [
    ['mouseenter', () => controller.onMouseenter()],
    ['mouseleave', () => controller.onMouseleave()],
    ['mousedown', (event) => controller.onMousedown(event)],
    ['mouseup', () => controller.onMouseup()],
    ['focus', () => controller.onFocus()],
    ['blur', () => controller.onBlur()],
  ]
  for (const [event, listener] of listeners) element.addEventListener(event, listener)

  return () => {
    for (const [event, listener] of listeners) element.removeEventListener(event, listener)
    controller.dispose()
  }
}

export interface MapZoomBinding {
  commands: ZoomCommands
  zoomBehavior: DefaultZoomBehavior
  dispose: () => void
}

/**
 * Attaches zoom after mount. Rebind when viewport or behavior options change.
 * The getters keep command geometry, transitions, and event callbacks current.
 * Commands become no-ops after disposal; the SVG's transform is preserved.
 */
export function bindMapZoom(
  context: () => MapContext,
  element: SVGGElement,
  getOptions: () => ZoomBehaviorOptions = () => ({}),
): MapZoomBinding {
  const svg = getSvgElement(element)
  if (!svg) throw new Error('bindMapZoom requires a group inside an SVG')
  zoomOwners.get(svg)?.()

  let isDisposed = false
  let dragView: Window | undefined
  const selection = select(svg)
  const tapHighlight = svg.style.getPropertyValue('-webkit-tap-highlight-color')
  const tapHighlightPriority = svg.style.getPropertyPriority('-webkit-tap-highlight-color')
  const zoomBehavior = createZoomBehavior(context(), {
    ...getOptions(),
    onZoomStart: (event) => {
      if (isDisposed) return
      const source = event.sourceEvent as MouseEvent | undefined
      if (source?.type === 'mousedown') dragView = source.view ?? undefined
      getOptions().onZoomStart?.(event)
    },
    onZoom: (event) => {
      if (isDisposed) return
      applyZoomEventTransform(element, event)
      getOptions().onZoom?.(event)
    },
    onZoomEnd: (event) => {
      if (isDisposed) return
      dragView = undefined
      getOptions().onZoomEnd?.(event)
    },
  })

  const target = createZoomCommands({
    element: () => isDisposed ? undefined : element,
    behavior: () => zoomBehavior,
    context,
    minZoom: () => getOptions().minZoom ?? ZOOM_DEFAULTS.minZoom,
    maxZoom: () => getOptions().maxZoom ?? ZOOM_DEFAULTS.maxZoom,
    transition: () => getOptions().transition,
  })
  const commands = createZoomCommandsProxy(() => isDisposed ? undefined : target)

  const dispose = (): void => {
    if (isDisposed) return
    isDisposed = true
    if (zoomOwners.get(svg) === dispose) {
      zoomOwners.delete(svg)
      selection.interrupt().on('.zoom', null)
      if (tapHighlight) svg.style.setProperty('-webkit-tap-highlight-color', tapHighlight, tapHighlightPriority)
      else svg.style.removeProperty('-webkit-tap-highlight-color')
    }
    if (dragView) {
      select(dragView).on('mousemove.zoom mouseup.zoom', null)
      dragEnable(dragView, false)
      dragView = undefined
    }
    zoomBehavior.on('start zoom end', null)
  }

  zoomOwners.set(svg, dispose)
  try {
    setupZoom({ element, behavior: zoomBehavior })
    applyZoomEventTransform(element, { transform: getCurrentZoomTransform(element) })
  } catch (error) {
    dispose()
    throw error
  }

  return { commands, zoomBehavior, dispose }
}
