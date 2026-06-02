'use client'

import type { MapSphereProps as CoreMapSphereProps } from '@d3-maps/core'
import type {
  ReactElement,
  SVGProps,
} from 'react'

import { renderSphere } from '@d3-maps/core'
import { useMemo } from 'react'

import { useMapContext } from '../hooks/useMapContext'

export interface MapSphereProps
  extends CoreMapSphereProps,
  Omit<SVGProps<SVGPathElement>, 'children'> {}

export function MapSphere({
  fill = 'none',
  stroke = 'none',
  ...props
}: MapSphereProps): ReactElement {
  const context = useMapContext()

  const path = useMemo(() => {
    return renderSphere(context) ?? undefined
  }, [context])

  return (
    <path
      data-d3m="sphere"
      {...props}
      d={path}
      fill={fill}
      pointerEvents="none"
      stroke={stroke}
    />
  )
}
