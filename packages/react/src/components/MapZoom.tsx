'use client'

import type {
  ZoomEvent,
  ZoomProps,
} from '@d3-maps/core'
import type {
  ReactElement,
  ReactNode,
  Ref,
  SVGProps,
} from 'react'

import type { MapZoomRef } from '../hooks/useMapZoom'

import {
  ZOOM_DEFAULTS,
} from '@d3-maps/core'
import {
  useImperativeHandle,
  useRef,
} from 'react'

import {
  useCreateMapZoom,
} from '../hooks/useCreateMapZoom'
import {
  MapZoomContextValue,
} from '../hooks/useMapZoom'

export interface MapZoomProps
  extends ZoomProps,
  Omit<SVGProps<SVGGElement>, 'children' | 'onZoom' | 'ref'> {
  children?: ReactNode
  onZoomStart?: (event: ZoomEvent) => void
  onZoom?: (event: ZoomEvent) => void
  onZoomEnd?: (event: ZoomEvent) => void
  ref?: Ref<MapZoomRef>
}

export function MapZoom(props: MapZoomProps): ReactElement {
  const {
    minZoom = ZOOM_DEFAULTS.minZoom,
    maxZoom = ZOOM_DEFAULTS.maxZoom,
    transition,
    config,
    onZoomStart,
    onZoom,
    onZoomEnd,
    children,
    className,
    ref,
    ...groupProps
  } = props
  const containerRef = useRef<SVGGElement | null>(null)

  const {
    commands,
    zoomBehavior,
  } = useCreateMapZoom(
    containerRef,
    {
      minZoom,
      maxZoom,
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
    zoomBehavior,
    ...commands,
  }), [
    commands,
    zoomBehavior,
  ])

  const mergedClassName = className
    ? `d3-map-zoom ${className}`
    : 'd3-map-zoom'

  return (
    <MapZoomContextValue.Provider value>
      <g
        data-d3m="zoom"
        {...groupProps}
        ref={containerRef}
        className={mergedClassName}
      >
        {children}
      </g>
    </MapZoomContextValue.Provider>
  )
}
