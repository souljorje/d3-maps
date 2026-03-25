'use client'

import type {
  ObjectZoomView,
  ZoomEvent,
  ZoomObject,
  ZoomProps,
} from '@d3-maps/core'
import type { RefObject } from 'react'

import {
  applyZoom,
  applyZoomGroupTransform,
  createZoomBehavior,
  getObjectZoomView,
  setupZoom,
} from '@d3-maps/core'
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
} from 'react'

import { useLatest } from './useLatest'
import {
  MapContextValue,
  useMapContext,
} from './useMapContext'

export type ZoomToObjectCallback = (view: ObjectZoomView) => void

export interface MapZoomState {
  center: [number, number] | undefined
  zoom: number
  minZoom: number
  maxZoom: number
}

export interface UseMapZoomResult extends MapZoomState {
  zoomToObject: (
    object: ZoomObject,
    callback: ZoomToObjectCallback,
  ) => void
}

export const MapZoomContextValue = createContext<MapZoomState | undefined>(undefined)

export interface MapZoomEventCallbacks {
  onZoomStart?: (event: ZoomEvent) => void
  onZoom?: (event: ZoomEvent) => void
  onZoomEnd?: (event: ZoomEvent) => void
}

export interface ResolvedMapZoomProps extends ZoomProps {
  zoom: number
  minZoom: number
  maxZoom: number
}

export interface CreateMapZoomResult {
  containerRef: RefObject<SVGGElement | null>
  zoomContext: MapZoomState
}

export function useCreateMapZoom(
  containerRef: RefObject<SVGGElement | null>,
  props: ResolvedMapZoomProps,
  eventCallbacks: MapZoomEventCallbacks,
): CreateMapZoomResult {
  const {
    center,
    zoom,
    minZoom,
    maxZoom,
    transition,
    config,
  } = props
  const context = useMapContext()

  const {
    onZoomStart,
    onZoom,
    onZoomEnd,
  } = eventCallbacks

  const onZoomStartRef = useLatest(onZoomStart)
  const onZoomRef = useLatest(onZoom)
  const onZoomEndRef = useLatest(onZoomEnd)

  const zoomBehavior = useMemo(() => {
    return createZoomBehavior(context, {
      minZoom,
      maxZoom,
      config,
      onZoomStart: (event) => {
        onZoomStartRef.current?.(event)
      },
      onZoom: (event) => {
        applyZoomGroupTransform(containerRef.current, event.transform)
        onZoomRef.current?.(event)
      },
      onZoomEnd: (event) => {
        onZoomEndRef.current?.(event)
      },
    })
  }, [
    config,
    context,
    maxZoom,
    minZoom,
  ])

  useEffect(() => {
    setupZoom({
      element: containerRef.current,
      behavior: zoomBehavior,
      center,
      zoom,
      transition,
    })
  }, [zoomBehavior])

  useEffect(() => {
    applyZoom({
      element: containerRef.current,
      behavior: zoomBehavior,
      center,
      zoom,
      transition,
    })
  }, [center, transition, zoom, zoomBehavior])

  const zoomContext = useMemo<MapZoomState>(() => ({
    center,
    zoom,
    minZoom,
    maxZoom,
  }), [
    center,
    maxZoom,
    minZoom,
    zoom,
  ])

  return {
    containerRef,
    zoomContext,
  }
}

export function useMapZoom(): UseMapZoomResult | undefined {
  const zoomContext = useContext(MapZoomContextValue)
  const mapContext = useContext(MapContextValue)

  return useMemo(() => {
    if (!zoomContext) return undefined

    return {
      ...zoomContext,
      zoomToObject: (object, callback) => {
        if (!mapContext) return

        const view = getObjectZoomView(mapContext, object, {
          minZoom: zoomContext.minZoom,
          maxZoom: zoomContext.maxZoom,
        })

        if (!view) return

        callback(view)
      },
    }
  }, [mapContext, zoomContext])
}
