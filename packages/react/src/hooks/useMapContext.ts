'use client'

import type { MapContext } from '@d3-maps/core'

import {
  createContext,
  useContext,
} from 'react'

export const MapContextValue = createContext<MapContext | undefined>(undefined)

export function useMapContext(): MapContext {
  const context = useContext(MapContextValue)

  if (!context) {
    throw new Error('useMapContext must be used inside Map')
  }

  return context
}
