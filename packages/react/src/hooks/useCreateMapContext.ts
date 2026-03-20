'use client'

import type {
  MapConfig,
  MapContext,
} from '@d3-maps/core'

import { makeMapContext } from '@d3-maps/core'
import { useMemo } from 'react'

export function useCreateMapContext(
  config?: Partial<MapConfig>,
  context?: MapContext,
): MapContext | undefined {
  return useMemo(() => {
    if (context) return context
    if (!config?.data) return undefined

    return makeMapContext(config as MapConfig)
  }, [
    context,
    config?.width,
    config?.height,
    config?.aspectRatio,
    config?.projection,
    config?.projectionConfig,
    config?.data,
    config?.dataTransformer,
  ])
}
