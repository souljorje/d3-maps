'use client'

import type { MapGraticuleProps as CoreMapGraticuleProps } from '@d3-maps/core'
import type {
  ReactElement,
  SVGProps,
} from 'react'

import {
  renderGraticule,
} from '@d3-maps/core'
import { useMemo } from 'react'

import { useMapContext } from '../hooks/useMapContext'

export interface MapGraticuleProps
  extends Omit<SVGProps<SVGPathElement>, 'children' | 'd' | 'fill'>,
  CoreMapGraticuleProps {}

export function MapGraticule({
  config,
  ...props
}: MapGraticuleProps): ReactElement | null {
  const context = useMapContext()

  const graticulePath = useMemo(() => {
    return renderGraticule(context, config) ?? undefined
  }, [context, config])

  return (
    <path
      {...props}
      d={graticulePath ?? undefined}
      fill="none"
      name="graticule"
    />
  )
}
