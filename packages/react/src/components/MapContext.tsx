'use client'

import type { MapContext as D3MapContext } from '@d3-maps/core'
import type {
  ReactElement,
  ReactNode,
} from 'react'

import { MapContextValue } from '../hooks/useMapContext'

interface MapProviderProps {
  context: D3MapContext
  children?: ReactNode
}

export function MapProvider({ context, children }: MapProviderProps): ReactElement {
  return (
    <MapContextValue.Provider value={context}>
      {children}
    </MapContextValue.Provider>
  )
}
