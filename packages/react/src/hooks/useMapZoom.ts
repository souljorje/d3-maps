'use client'

import type { DefaultZoomBehavior, ZoomCommands } from '@d3-maps/core'
import type { RefObject } from 'react'

import { useMemo } from 'react'

export type MapZoomRef = {
  container: SVGGElement | null
  zoomBehavior: DefaultZoomBehavior
} & ZoomCommands

export function useMapZoom(
  ref: RefObject<MapZoomRef | null>,
): ZoomCommands {
  return useMemo(() => ({
    transform: (...args) => ref.current?.transform(...args),
    translateBy: (...args) => ref.current?.translateBy(...args),
    translateTo: (...args) => ref.current?.translateTo(...args),
    scaleBy: (...args) => ref.current?.scaleBy(...args),
    scaleTo: (...args) => ref.current?.scaleTo(...args),
    scaleWith: (...args) => ref.current?.scaleWith(...args),
    zoomToFeature: (...args) => ref.current?.zoomToFeature(...args) ?? false,
    reset: (...args) => ref.current?.reset(...args),
  }), [ref])
}
