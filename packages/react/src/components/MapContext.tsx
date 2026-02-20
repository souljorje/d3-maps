'use client'

import type { MapContext as D3MapContext } from '@d3-maps/core'
import type {
  ReactElement,
  ReactNode,
} from 'react'

import { createContext, useContext } from 'react'

interface MapProviderProps {
  context: D3MapContext
  children?: ReactNode
}

const MapContextValue = createContext<D3MapContext | undefined>(undefined)

export function MapProvider({ context, children }: MapProviderProps): ReactElement {
  return (
    <MapContextValue.Provider value={context}>
      {children}
    </MapContextValue.Provider>
  )
}

export function useMapContext(): D3MapContext | undefined {
  return useContext(MapContextValue)
}
