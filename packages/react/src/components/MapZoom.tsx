'use client'

import type {
  DefaultZoomBehavior,
  ZoomEvent,
  ZoomProps,
} from '@d3-maps/core'
import type {
  ReactElement,
  ReactNode,
  SVGProps,
} from 'react'

import type { MapZoomCommands } from '../hooks/useCreateMapZoom'

import {
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react'

import {
  MapZoomContextValue,
  MapZoomPresenceContextValue,
} from '../hooks/internal/mapZoomContext'
import {
  useCreateMapZoom,
} from '../hooks/useCreateMapZoom'

export interface MapZoomHandle extends MapZoomCommands {
  container: SVGGElement | null
  zoomBehavior: DefaultZoomBehavior
}

export interface MapZoomProps
  extends ZoomProps,
  Omit<SVGProps<SVGGElement>, 'children' | 'onZoom'> {
  children?: ReactNode
  onZoomStart?: (event: ZoomEvent) => void
  onZoom?: (event: ZoomEvent) => void
  onZoomEnd?: (event: ZoomEvent) => void
}

export const MapZoom = forwardRef<MapZoomHandle, MapZoomProps>((
  props,
  ref,
): ReactElement => {
  const {
    minZoom,
    maxZoom,
    transition,
    config,
    onZoomStart,
    onZoom,
    onZoomEnd,
    children,
    className,
    ...groupProps
  } = props
  const containerRef = useRef<SVGGElement | null>(null)

  const {
    reset,
    zoomContext,
    zoomBehavior,
    zoomBy,
    zoomTo,
    zoomToFeature,
    zoomToScale,
  } = useCreateMapZoom(
    containerRef,
    {
      minZoom: minZoom ?? 1,
      maxZoom: maxZoom ?? 8,
      transition,
      config,
    },
    {
      onZoomStart,
      onZoom,
      onZoomEnd,
    },
  )

  useImperativeHandle(ref, () => ({
    container: containerRef.current,
    reset,
    zoomBehavior,
    zoomBy,
    zoomTo,
    zoomToFeature,
    zoomToScale,
  }), [
    reset,
    zoomBehavior,
    zoomBy,
    zoomTo,
    zoomToFeature,
    zoomToScale,
  ])

  const mergedClassName = className
    ? `d3-map-zoom ${className}`
    : 'd3-map-zoom'

  return (
    <MapZoomPresenceContextValue.Provider value>
      <MapZoomContextValue.Provider value={zoomContext}>
        <g
          {...groupProps}
          ref={containerRef}
          className={mergedClassName}
          name="zoom"
        >
          {children}
        </g>
      </MapZoomContextValue.Provider>
    </MapZoomPresenceContextValue.Provider>
  )
})
