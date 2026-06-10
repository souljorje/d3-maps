import type { DefaultZoomBehavior, ZoomCommands } from '@d3-maps/core'
import type { Ref } from 'vue'

import { createZoomCommandsProxy } from '@d3-maps/core'
import { useTemplateRef } from 'vue'

export type MapZoomRef = {
  container: SVGGElement | null
  zoomBehavior: DefaultZoomBehavior
} & ZoomCommands

export function useMapZoom(
  ref: Ref<MapZoomRef | null> | string,
): ZoomCommands {
  const zoomRef = typeof ref === 'string' ? useTemplateRef<MapZoomRef>(ref) : ref
  return createZoomCommandsProxy(() => zoomRef.value)
}
