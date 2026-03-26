'use client'

import type {
  MapContext,
  MapProps,
} from '@d3-maps/core'

import { makeMapContext } from '@d3-maps/core'
import { useMemo } from 'react'

export function useCreateMapContext(
  config?: Partial<MapProps>,
  context?: MapContext,
): MapContext | undefined {
  return useMemo(() => {
    if (context) return context
    if (!config?.data) return undefined

    return makeMapContext(config as MapProps)
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
