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
import { MapElement } from './MapElement'

export interface MapMarkerProps
  extends CoreMapMarkerProps<CSSProperties>,
  SVGProps<SVGGElement> {}

export function MapMarker({
  coordinates,
  styles,
  children,
  ...props
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

  if (!transform) return null

  return (
    <MapElement
      tag="g"
      data-d3m="marker"
      {...props}
      transform={transform}
      styles={styles}
    >
      {children}
    </MapElement>
  )
}
