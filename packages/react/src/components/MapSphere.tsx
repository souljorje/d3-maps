'use client'

import type { MapSphereProps as CoreMapSphereProps } from '@d3-maps/core'
import type {
  CSSProperties,
  ReactElement,
  SVGProps,
} from 'react'

import { renderSphere } from '@d3-maps/core'
import { useMemo } from 'react'

import { useMapContext } from '../hooks/useMapContext'
import { MapObject } from './MapObject'

export interface MapSphereProps
  extends CoreMapSphereProps<CSSProperties>,
  Omit<SVGProps<SVGPathElement>, 'children'> {}

export function MapSphere({
  fill = 'none',
  stroke = 'currentColor',
  ...props
}: MapSphereProps): ReactElement {
  const context = useMapContext()

  const path = useMemo(() => {
    return renderSphere(context) ?? undefined
  }, [context])

  return (
    <MapObject
      d={path}
      fill={fill}
      name="sphere"
      pointerEvents="none"
      stroke={stroke}
      {...props}
    />
  )
}
