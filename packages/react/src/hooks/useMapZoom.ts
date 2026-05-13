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
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react'

import {
  MapZoomContextValue,
  MapZoomPresenceContextValue,
} from './internal/mapZoomContext'
import { useLatest } from './useLatest'
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
  const centerX = center?.[0]
  const centerY = center?.[1]
  const resolvedCenter = useMemo<[number, number] | undefined>(() => {
    if (centerX === undefined || centerY === undefined) return undefined

    return [centerX, centerY]
  }, [centerX, centerY])

  const onZoomStartEvent = useCallback((event: ZoomEvent) => {
    onZoomStartRef.current?.(event)
  }, [])
  const onZoomEvent = useCallback((event: ZoomEvent) => {
    applyZoomGroupTransform(containerRef.current, event.transform)
    onZoomRef.current?.(event)
  }, [])
  const onZoomEndEvent = useCallback((event: ZoomEvent) => {
    onZoomEndRef.current?.(event)
  }, [])

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

export function useInsideMapZoom(): boolean {
  return useContext(MapZoomPresenceContextValue)
}
