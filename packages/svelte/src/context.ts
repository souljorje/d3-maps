import type { MapContext, ZoomCommands, ZoomCommandTarget } from '@d3-maps/core'

import type { MapZoomHandle } from './types'

import { createZoomCommandsProxy } from '@d3-maps/core'
import { getContext } from 'svelte'

export const MAP_CONTEXT = Symbol('d3-maps-context')
export const MAP_ZOOM_CONTEXT = Symbol('d3-maps-zoom')

/** Read the returned getter in a derived expression or template to track map updates. */
export function useMapContext(): () => MapContext {
  const context = getContext<(() => MapContext) | undefined>(MAP_CONTEXT)
  if (!context) throw new Error('useMapContext must be used inside MapBase')
  return context
}

/** Uses the nearest MapZoom, or proxies a caller-owned bind:this target getter. */
export function useMapZoom(target?: () => ZoomCommandTarget): ZoomCommands {
  if (target) return createZoomCommandsProxy(target)
  const zoom = getContext<MapZoomHandle | undefined>(MAP_ZOOM_CONTEXT)
  if (!zoom) throw new Error('useMapZoom must be used inside MapZoom or receive a target getter')
  return zoom
}
