'use client'

import type { DefaultZoomBehavior, ZoomCommands } from '@d3-maps/core'
import type { RefObject } from 'react'

import { createZoomCommandsProxy } from '@d3-maps/core'
import { createContext, useMemo } from 'react'

export const MapZoomContextValue = createContext(false)

export type MapZoomRef = {
  container: SVGGElement | null
  zoomBehavior: DefaultZoomBehavior
} & ZoomCommands

export function useMapZoom(
  ref: RefObject<MapZoomRef | null>,
): ZoomCommands {
  return useMemo(() => createZoomCommandsProxy(() => ref.current), [ref])
}
