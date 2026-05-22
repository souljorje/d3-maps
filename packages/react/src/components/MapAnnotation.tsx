'use client'

import type { MapAnnotationProps as CoreMapAnnotationProps } from '@d3-maps/core'
import type {
  CSSProperties,
  ReactElement,
  ReactNode,
  SVGProps,
} from 'react'

import {
  getAnnotationGeometry,
} from '@d3-maps/core'
import { useMemo } from 'react'

import { MapLine } from './MapLine'
import { MapMarker } from './MapMarker'

export interface MapAnnotationProps
  extends CoreMapAnnotationProps<CSSProperties>,
  Omit<SVGProps<SVGPathElement>, 'children' | 'd'> {
  children?: ReactNode
}

export function MapAnnotation({
  coordinates,
  length,
  angle,
  margin,
  curve,
  midpoint,
  styles,
  children,
  ...pathProps
}: MapAnnotationProps): ReactElement | null {
  const geometry = useMemo(() => {
    return getAnnotationGeometry({
      length,
      angle,
      margin,
    })
  }, [
    length,
    angle,
    margin,
  ])

  return (
    <MapMarker
      coordinates={coordinates}
      data-d3m="annotation"
    >
      <g transform={geometry.lineTransform}>
        <MapLine
          {...pathProps}
          coordinates={geometry.lineCoordinates}
          cartesian
          curve={curve}
          midpoint={midpoint}
          styles={styles}
          fill="none"
          data-d3m="annotation-line"
        />
      </g>
      <g
        data-d3m="annotation-content"
        transform={geometry.contentTransform}
      >
        {children}
      </g>
    </MapMarker>
  )
}
