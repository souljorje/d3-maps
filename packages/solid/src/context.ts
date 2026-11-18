import type { MapContext, ZoomCommands, ZoomCommandTarget } from '@d3-maps/core'
import type { Accessor } from 'solid-js'

import type { MapZoomHandle } from './types'

import { createZoomCommandsProxy } from '@d3-maps/core'
import { createContext, useContext } from 'solid-js'

export const MapContextValue = createContext<Accessor<MapContext>>()
export const MapZoomContextValue = createContext<MapZoomHandle>()

/** Read the accessor in JSX or a computation to track projection and viewport updates. */
export function useMapContext(): Accessor<MapContext> {
  const context = useContext(MapContextValue)
  if (!context) throw new Error('useMapContext must be used inside MapBase')
  return context
}

/** Reads the nearest zoom context or proxies a caller-owned onReady target. */
export function useMapZoom(target?: Accessor<ZoomCommandTarget>): ZoomCommands {
  if (target) return createZoomCommandsProxy(target)
  const zoom = useContext(MapZoomContextValue)
  if (!zoom) throw new Error('useMapZoom must be used inside MapZoom or receive a target getter')
  return zoom
}
