'use client'

import type {
  ZoomEvent,
  ZoomProps,
} from '@d3-maps/core'
import type {
  ReactElement,
  ReactNode,
  SVGProps,
} from 'react'

import {
  applyZoom,
  applyZoomGroupTransform,
  createZoomBehavior,
  setupZoom,
  ZOOM_DEFAULTS,
} from '@d3-maps/core'
import {
  useEffect,
  useMemo,
  useRef,
} from 'react'

import { InsideZoomContext } from '../hooks/useInsideZoom'
import { useLatest } from '../hooks/useLatest'
import { useMapContext } from '../hooks/useMapContext'

export interface MapZoomProps
  extends ZoomProps,
  Omit<SVGProps<SVGGElement>, 'children' | 'onZoom'> {
  children?: ReactNode
  onZoomStart?: (event: ZoomEvent) => void
  onZoom?: (event: ZoomEvent) => void
  onZoomEnd?: (event: ZoomEvent) => void
}

export function MapZoom({
  center,
  zoom,
  minZoom = ZOOM_DEFAULTS.minZoom,
  maxZoom = ZOOM_DEFAULTS.maxZoom,
  transition,
  config,
  onZoomStart,
  onZoom,
  onZoomEnd,
  children,
  className,
  ...groupProps
}: MapZoomProps): ReactElement {
  const containerRef = useRef<SVGGElement | null>(null)
  const skipNextTransformSyncRef = useRef(false)
  const context = useMapContext()

  const onZoomStartRef = useLatest(onZoomStart)
  const onZoomRef = useLatest(onZoom)
  const onZoomEndRef = useLatest(onZoomEnd)

  const resolvedZoom = zoom ?? ZOOM_DEFAULTS.zoom
  const centerX = center?.[0]
  const centerY = center?.[1]

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
    context,
    minZoom,
    maxZoom,
    config,
  ])

  useEffect(() => {
    skipNextTransformSyncRef.current = true

    setupZoom({
      element: containerRef.current,
      behavior: zoomBehavior,
      center: centerX !== undefined && centerY !== undefined
        ? [centerX, centerY]
        : undefined,
      zoom: resolvedZoom,
      transition,
    })
  }, [
    zoomBehavior,
  ])

  useEffect(() => {
    if (skipNextTransformSyncRef.current) {
      skipNextTransformSyncRef.current = false
      return
    }

    applyZoom({
      element: containerRef.current,
      behavior: zoomBehavior,
      center: centerX !== undefined && centerY !== undefined
        ? [centerX, centerY]
        : undefined,
      zoom: resolvedZoom,
      transition,
    })
  }, [
    centerX,
    centerY,
    transition,
    zoomBehavior,
    resolvedZoom,
  ])

  const mergedClassName = className
    ? `d3-map-zoom ${className}`
    : 'd3-map-zoom'

  return (
    <InsideZoomContext.Provider value={true}>
      <g
        {...groupProps}
        ref={containerRef}
        className={mergedClassName}
        name="zoom"
      >
        {children}
      </g>
    </InsideZoomContext.Provider>
  )
}
