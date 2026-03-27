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
  useEffectEvent,
  useMemo,
} from 'react'

import {
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
  const centerX = center?.[0]
  const centerY = center?.[1]
  const resolvedCenter = useMemo<[number, number] | undefined>(() => {
    if (centerX === undefined || centerY === undefined) return undefined

    return [centerX, centerY]
  }, [centerX, centerY])

  const onZoomStartEvent = useEffectEvent((event: ZoomEvent) => {
    onZoomStart?.(event)
  })
  const onZoomEvent = useEffectEvent((event: ZoomEvent) => {
    applyZoomGroupTransform(containerRef.current, event.transform)
    onZoom?.(event)
  })
  const onZoomEndEvent = useEffectEvent((event: ZoomEvent) => {
    onZoomEnd?.(event)
  })

  const zoomBehavior = useMemo(() => {
    return createZoomBehavior({
      width: context.width,
      height: context.height,
    }, {
      minZoom,
      maxZoom,
      config,
      onZoomStart: onZoomStartEvent,
      onZoom: onZoomEvent,
      onZoomEnd: onZoomEndEvent,
    })
  }, [
    config,
    context.height,
    context.width,
    maxZoom,
    minZoom,
  ])

  useEffect(() => {
    setupZoom({
      element: containerRef.current,
      behavior: zoomBehavior,
    })
  }, [zoomBehavior])

  useEffect(() => {
    applyZoom({
      element: containerRef.current,
      behavior: zoomBehavior,
      center: resolvedCenter,
      zoom,
      transition,
    })
  }, [centerX, centerY, transition, zoom, zoomBehavior])

  const zoomContext = useMemo<MapZoomState>(() => ({
    center: resolvedCenter,
    zoom,
    minZoom,
    maxZoom,
  }), [
    resolvedCenter,
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
  const mapContext = useMapContext()

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
