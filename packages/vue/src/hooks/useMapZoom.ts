import type { DefaultZoomBehavior, ZoomCommands } from '@d3-maps/core'
import type { Ref } from 'vue'

export type MapZoomRef = {
  container: SVGGElement | null
  zoomBehavior: DefaultZoomBehavior
} & ZoomCommands

export function useMapZoom(
  ref: Ref<MapZoomRef | null>,
): ZoomCommands {
  return {
    transform: (...args) => ref.value?.transform(...args),
    translateBy: (...args) => ref.value?.translateBy(...args),
    translateTo: (...args) => ref.value?.translateTo(...args),
    scaleBy: (...args) => ref.value?.scaleBy(...args),
    scaleTo: (...args) => ref.value?.scaleTo(...args),
    scaleWith: (...args) => ref.value?.scaleWith(...args),
    zoomToFeature: (...args) => ref.value?.zoomToFeature(...args) ?? false,
    reset: (...args) => ref.value?.reset(...args),
  }
}
