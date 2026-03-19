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

import { useMapContext } from '../hooks/useMapContext'
import { useMapObject } from '../hooks/useMapObject'

export interface MapAnnotationProps
  extends CoreMapAnnotationProps<CSSProperties>,
  Omit<SVGProps<SVGPathElement>, 'children' | 'd' | 'style' | 'transform'> {
  children?: ReactNode
}

export function MapAnnotation({
  coordinates,
  length,
  angle,
  margin,
  styles,
  children,
  ...pathProps
}: MapAnnotationProps): ReactElement | null {
  const context = useMapContext()

  const geometry = useMemo(() => {
    return getAnnotationGeometry(context, coordinates, {
      length,
      angle,
      margin,
    })
  }, [
    context,
    coordinates,
    length,
    angle,
    margin,
  ])

  const { style, ...events } = useMapObject<SVGPathElement>({
    styles,
    onMouseEnter: pathProps.onMouseEnter,
    onMouseLeave: pathProps.onMouseLeave,
    onMouseDown: pathProps.onMouseDown,
    onMouseUp: pathProps.onMouseUp,
  })

  if (!geometry) return null

  const {
    onMouseEnter: _onMouseEnter,
    onMouseLeave: _onMouseLeave,
    onMouseDown: _onMouseDown,
    onMouseUp: _onMouseUp,
    fill,
    name,
    ...restPathProps
  } = pathProps

  return (
    <g
      transform={geometry.anchorTransform}
      name="annotation"
    >
      <g transform={geometry.connectorTransform}>
        <path
          {...restPathProps}
          d={geometry.connectorPath}
          style={style}
          fill={fill ?? 'none'}
          name={name ?? 'annotation-line'}
          {...events}
        />
      </g>
      <g
        transform={geometry.contentTransform}
        name="annotation-content"
      >
        {children}
      </g>
    </g>
  )
}
