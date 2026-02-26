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
  applyZoomGroupTransform,
  applyZoomTransform,
  createZoomBehavior,
  setupZoom,
  ZOOM_DEFAULTS,
} from '@d3-maps/core'
import {
  useEffect,
  useMemo,
  useRef,
} from 'react'

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

  const resolvedCenter = center ?? ZOOM_DEFAULTS.center
  const resolvedZoom = zoom ?? ZOOM_DEFAULTS.zoom
  const centerX = resolvedCenter[0]
  const centerY = resolvedCenter[1]

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
      center: resolvedCenter,
      zoom: resolvedZoom,
    })
  }, [zoomBehavior])

  useEffect(() => {
    if (skipNextTransformSyncRef.current) {
      skipNextTransformSyncRef.current = false
      return
    }

    applyZoomTransform({
      element: containerRef.current,
      behavior: zoomBehavior,
      center: [centerX, centerY],
      zoom: resolvedZoom,
    })
  }, [
    zoomBehavior,
    centerX,
    centerY,
    resolvedZoom,
  ])

  const mergedClassName = className
    ? `d3-map-zoom ${className}`
    : 'd3-map-zoom'

  return (
    <g
      {...groupProps}
      ref={containerRef}
      className={mergedClassName}
      name="zoom"
    >
      {children}
    </g>
  )
}
