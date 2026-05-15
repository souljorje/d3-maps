'use client'

import type { MapObjectProps } from '@d3-maps/core'
import type {
  CSSProperties,
  ReactElement,
  SVGProps,
} from 'react'

import { useMemo } from 'react'

import { useMapContext } from '../hooks/useMapContext'
import { MapObject } from './MapObject'

export interface MapMeshProps
  extends Omit<SVGProps<SVGPathElement>, 'children' | 'd' | 'style'>,
  MapObjectProps<CSSProperties> {}

export function MapMesh({
  styles,
  fill = 'none',
  ...props
}: MapMeshProps): ReactElement | null {
  const context = useMapContext()

  const path = useMemo(() => {
    return context.renderMesh() ?? undefined
  }, [context])

  return (
    <MapObject
      {...props}
      d={path}
      styles={styles}
      fill={fill}
      name="mesh"
    />
  )
}
