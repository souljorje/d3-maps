import type { MapContext } from '@d3-maps/core'
import type {
  ComputedRef,
  InjectionKey,
} from 'vue'

import { inject } from 'vue'

export const mapContextKey: InjectionKey<ComputedRef<MapContext>> = Symbol('MapContext')

export function useMapContext(): ComputedRef<MapContext> | undefined {
  return inject(mapContextKey)
}
