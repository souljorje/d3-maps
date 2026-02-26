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

const DEFAULT_COORDINATES: [number, number] = [0, 0]

export interface MapMarkerProps
  extends CoreMapMarkerProps<CSSProperties>,
  Omit<SVGProps<SVGGElement>, 'style'> {}

export function MapMarker({
  coordinates = DEFAULT_COORDINATES,
  styles,
  children,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  ...groupProps
}: MapMarkerProps): ReactElement {
  const context = useMapContext()

  const transform = useMemo(() => {
    return getMarkerTransform(context, coordinates)
  }, [
    context,
    coordinates[0],
    coordinates[1],
  ])

  const { style, ...events } = useMapObject<SVGGElement>({
    styles,
    onMouseEnter,
    onMouseLeave,
    onMouseDown,
    onMouseUp,
  })

  return (
    <g
      {...groupProps}
      transform={transform}
      style={style}
      name="marker"
      {...events}
    >
      {children}
    </g>
  )
}
