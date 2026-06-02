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
): MapContext {
  return useMemo(() => {
    if (context) return context

    return makeMapContext(config)
  }, [
    context,
    config?.width,
    config?.height,
    config?.aspectRatio,
    config?.projection,
    config?.projectionConfig,
    config?.fit,
    config?.fitObjectKey,
    config?.padding,
  ])
}
