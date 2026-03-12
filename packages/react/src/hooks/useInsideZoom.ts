'use client'

import {
  createContext,
  useContext,
} from 'react'

export const InsideZoomContext = createContext(false)

export function useInsideZoom(): boolean {
  return useContext(InsideZoomContext)
}
