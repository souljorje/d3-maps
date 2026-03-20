'use client'

import type { MapMarkerProps as CoreMapMarkerProps } from '@d3-maps/core'
import type {
  CSSProperties,
  ReactElement,
  SVGProps,
} from 'react'

import { getMarkerTransform } from '@d3-maps/core'
import { useMemo } from 'react'

import { useMapContext } from '../hooks/useMapContext'
import { useMapObject } from '../hooks/useMapObject'

export interface MapMarkerProps
  extends CoreMapMarkerProps<CSSProperties>,
  Omit<SVGProps<SVGGElement>, 'style'> {
  name?: string
}

export function MapMarker({
  coordinates,
  styles,
  children,
  name = 'marker',
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  ...groupProps
}: MapMarkerProps): ReactElement | null {
  const context = useMapContext()

  const transform = useMemo(() => {
    if (!coordinates) return undefined
    return getMarkerTransform(context, coordinates)
  }, [
    context,
    coordinates?.[0],
    coordinates?.[1],
  ])

  const { style, ...events } = useMapObject<SVGGElement>({
    styles,
    onMouseEnter,
    onMouseLeave,
    onMouseDown,
    onMouseUp,
  })

  if (!transform) return null

  return (
    <g
      {...groupProps}
      transform={transform}
      style={style}
      name={name}
      {...events}
    >
      {children}
    </g>
  )
}
