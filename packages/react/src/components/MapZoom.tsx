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
} from '@d3-maps/core'
import { useRef } from 'react'

import { MapZoomContextValue, useCreateMapZoom } from '../hooks/useMapZoom'

export interface MapZoomProps
  extends ZoomProps,
  Omit<SVGProps<SVGGElement>, 'children' | 'onZoom'> {
  children?: ReactNode
  onZoomStart?: (event: ZoomEvent) => void
  onZoom?: (event: ZoomEvent) => void
  onZoomEnd?: (event: ZoomEvent) => void
}

export function MapZoom(props: MapZoomProps): ReactElement {
  const {
    center,
    zoom,
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

  const { zoomContext } = useCreateMapZoom(
    containerRef,
    {
      center,
      zoom: zoom ?? 1,
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

  const mergedClassName = className
    ? `d3-map-zoom ${className}`
    : 'd3-map-zoom'

  return (
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
  )
}
