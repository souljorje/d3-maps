'use client'

import type { MapMeshProps as CoreMapMeshProps } from '@d3-maps/core'
import type {
  ReactElement,
  SVGProps,
} from 'react'

import {
  renderMesh,
} from '@d3-maps/core'
import { useMemo } from 'react'

import { useMapContext } from '../hooks/useMapContext'

export interface MapMeshProps
  extends Omit<SVGProps<SVGPathElement>, 'children' | 'd'>,
  CoreMapMeshProps {}

export function MapMesh({
  data,
  objectKey,
  fill = 'none',
  ...props
}: MapMeshProps): ReactElement | null {
  const context = useMapContext()

  const path = useMemo(
    () => renderMesh(context, data, objectKey) ?? undefined,
    [context, data, objectKey],
  )

  return (
    <path
      {...props}
      d={path}
      fill={fill}
      name="mesh"
    />
  )
}
