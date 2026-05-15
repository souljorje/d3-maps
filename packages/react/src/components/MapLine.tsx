'use client'

import type { MapLineProps as CoreMapLineProps } from '@d3-maps/core'
import type {
  CSSProperties,
  ReactElement,
  SVGProps,
} from 'react'

import { getLinePath } from '@d3-maps/core'
import { useMemo } from 'react'

import { useMapContext } from '../hooks/useMapContext'
import { MapObject } from './MapObject'

export interface MapLineProps
  extends CoreMapLineProps<CSSProperties>,
  Omit<SVGProps<SVGPathElement>, 'children' | 'd' | 'style'> {}

export function MapLine({
  coordinates,
  cartesian = false,
  custom = false,
  curve,
  midpoint,
  styles,
  name = 'line',
  fill = 'none',
  ...props
}: MapLineProps): ReactElement {
  const context = useMapContext()

  const path = useMemo(() => {
    return getLinePath(context, {
      coordinates,
      custom,
      curve,
      cartesian,
      midpoint,
    })
  }, [
    context,
    coordinates,
    custom,
    curve,
    cartesian,
    midpoint,
  ])

  return (
    <MapObject
      {...props}
      d={path}
      styles={styles}
      fill={fill}
      name={name}
    />
  )
}
