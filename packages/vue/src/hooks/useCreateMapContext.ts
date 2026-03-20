import type {
  MapConfig,
  MapContext,
} from '@d3-maps/core'
import type {
  ComputedRef,
  MaybeRef,
} from 'vue'

import { makeMapContext } from '@d3-maps/core'
import {
  computed,
  unref,
} from 'vue'

export function useCreateMapContext(
  config?: MaybeRef<Partial<MapConfig> | undefined>,
  context?: MaybeRef<MapContext | undefined>,
): ComputedRef<MapContext | undefined> {
  return computed(() => {
    const resolvedContext = unref(context)
    if (resolvedContext) return resolvedContext

    const resolvedConfig = unref(config)
    if (!resolvedConfig?.data) return undefined

    return makeMapContext(resolvedConfig as MapConfig)
  })
}
