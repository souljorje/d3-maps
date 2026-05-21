'use client'

import type { MapMeshProps as CoreMapMeshProps } from '@d3-maps/core'
import type {
  CSSProperties,
  ReactElement,
  SVGProps,
} from 'react'

import {
  renderMesh,
} from '@d3-maps/core'
import { useMemo } from 'react'

import { useMapContext } from '../hooks/useMapContext'
import { MapObject } from './MapObject'

export interface MapMeshProps
  extends Omit<SVGProps<SVGPathElement>, 'children' | 'd' | 'style'>,
  CoreMapMeshProps<CSSProperties> {}

export function MapMesh({
  data,
  objectKey,
  styles,
  fill = 'none',
  ...props
}: MapMeshProps): ReactElement | null {
  const context = useMapContext()

  const path = useMemo(
    () => renderMesh(context, data, objectKey) ?? undefined,
    [context, data, objectKey],
  )

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
