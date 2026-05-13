'use client'

import type { MapZoomState } from '../useMapZoom'

import { createContext } from 'react'

export const MapZoomPresenceContextValue = createContext(false)
export const MapZoomContextValue = createContext<MapZoomState | undefined>(undefined)
