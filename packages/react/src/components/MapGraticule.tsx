'use client'

import type { MapGraticuleProps as CoreMapGraticuleProps } from '@d3-maps/core'
import type {
  CSSProperties,
  ReactElement,
  SVGProps,
} from 'react'

import {
  renderGraticule,
} from '@d3-maps/core'
import { useMemo } from 'react'

import { useMapContext } from '../hooks/useMapContext'
import { MapObject } from './MapObject'

export interface MapGraticuleProps
  extends Omit<SVGProps<SVGPathElement>, 'children' | 'd' | 'style' | 'fill'>,
  CoreMapGraticuleProps<CSSProperties> {}

export function MapGraticule({
  config,
  styles,
  ...props
}: MapGraticuleProps): ReactElement | null {
  const context = useMapContext()

  const graticulePath = useMemo(() => {
    return renderGraticule(context, config) ?? undefined
  }, [context, config])

  return (
    <MapObject
      {...props}
      d={graticulePath ?? undefined}
      styles={styles}
      fill="none"
      name="graticule"
    />
  )
}
