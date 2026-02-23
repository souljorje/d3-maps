import type { MapContext } from '@d3-maps/core'
import type { InjectionKey } from 'vue'

import { inject } from 'vue'

export const mapContextKey: InjectionKey<MapContext> = Symbol('MapContext')

export function useMapContext(): MapContext | undefined {
  return inject(mapContextKey)
}
