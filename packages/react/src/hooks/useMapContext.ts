'use client'

import type { MapContext } from '@d3-maps/core'

import {
  createContext,
  useContext,
} from 'react'

export const MapContextValue = createContext<MapContext | undefined>(undefined)

export function useMapContext(): MapContext | undefined {
  return useContext(MapContextValue)
}
