import type { MapContext } from './map'
import type { DefaultZoomBehavior, ZoomBehaviorOptions, ZoomCommands } from './zoom'

import { select } from 'd3-selection'

import { getSvgElement } from './utils'
import {
  applyZoomEventTransform,
  createZoomBehavior,
  createZoomCommands,
  createZoomCommandsProxy,
  setupZoom,
  ZOOM_DEFAULTS,
} from './zoom'

const zoomEventNames = [
  'wheel.zoom',
  'mousedown.zoom',
  'dblclick.zoom',
  'touchstart.zoom',
  'touchmove.zoom',
  'touchend.zoom',
  'touchcancel.zoom',
] as const

/** Owns the D3 zoom listeners independently of a framework component. */
export interface ZoomBinding {
  readonly commands: ZoomCommands
  readonly zoomBehavior: DefaultZoomBehavior
  update: () => void
  dispose: () => void
}

/**
 * Attach zoom to a mounted map group. Frameworks call update when geometry or
 * behavior options change and dispose when the group unmounts.
 *
 * Listener references belong to this binding, not to component state.
 */
export function createZoomBinding(
  context: () => MapContext,
  element: SVGGElement,
  getOptions: () => ZoomBehaviorOptions = () => ({}),
): ZoomBinding {
  const svg = getSvgElement(element)
  if (!svg) throw new Error('createZoomBinding requires a group inside an SVG')

  const selection = select(svg)
  const tapHighlight = svg.style.getPropertyValue('-webkit-tap-highlight-color')
  const tapHighlightPriority = svg.style.getPropertyPriority('-webkit-tap-highlight-color')
  let isDisposed = false
  let behavior: DefaultZoomBehavior | undefined
  let listeners: { name: string, listener: unknown }[] = []

  const releaseListeners = (): boolean => {
    let hasOwnedListener = false
    for (const { name, listener } of listeners) {
      if (listener && selection.on(name) === listener) {
        selection.on(name, null)
        hasOwnedListener = true
      }
    }
    listeners = []
    return hasOwnedListener
  }

  const target = createZoomCommands({
    element: () => isDisposed ? undefined : element,
    behavior: () => behavior!,
    context,
    minZoom: () => getOptions().minZoom ?? ZOOM_DEFAULTS.minZoom,
    maxZoom: () => getOptions().maxZoom ?? ZOOM_DEFAULTS.maxZoom,
    transition: () => getOptions().transition,
  })
  const commands = createZoomCommandsProxy(() => isDisposed ? undefined : target)

  const update = (): void => {
    if (isDisposed) return
    releaseListeners()
    behavior?.on('start zoom end', null)

    behavior = createZoomBehavior(context(), {
      ...getOptions(),
      onZoomStart: (event) => getOptions().onZoomStart?.(event),
      onZoom: (event) => {
        applyZoomEventTransform(element, event)
        getOptions().onZoom?.(event)
      },
      onZoomEnd: (event) => getOptions().onZoomEnd?.(event),
    })
    setupZoom({ element, behavior })
    listeners = zoomEventNames.map((name) => ({ name, listener: selection.on(name) }))
  }

  const dispose = (): void => {
    if (isDisposed) return
    isDisposed = true
    const hasOwnedListener = releaseListeners()
    behavior?.on('start zoom end', null)
    if (hasOwnedListener) {
      if (tapHighlight) svg.style.setProperty('-webkit-tap-highlight-color', tapHighlight, tapHighlightPriority)
      else svg.style.removeProperty('-webkit-tap-highlight-color')
    }
  }

  update()
  return {
    commands,
    get zoomBehavior() {
      return behavior!
    },
    update,
    dispose,
  }
}
