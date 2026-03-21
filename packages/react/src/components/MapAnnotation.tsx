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

import { useMapObject } from '../hooks/useMapObject'
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
  styles,
  children,
  ...pathProps
}: MapAnnotationProps): ReactElement | null {
  const geometry = useMemo(() => {
    return getAnnotationGeometry({
      length,
      angle,
      margin,
      curve,
    })
  }, [
    length,
    angle,
    margin,
    curve,
  ])

  const { style, ...events } = useMapObject<SVGGElement>({
    styles,
  })

  return (
    <MapMarker
      coordinates={coordinates}
      name="annotation"
      {...events}
    >
      <g transform={geometry.lineTransform}>
        <path
          {...pathProps}
          d={geometry.linePath}
          style={style}
          fill="none"
          name="annotation-line"
        />
      </g>
      <g
        transform={geometry.contentTransform}
        name="annotation-content"
      >
        {children}
      </g>
    </MapMarker>
  )
}
