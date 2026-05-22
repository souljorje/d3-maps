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
  extends Omit<SVGProps<SVGPathElement>, 'children' | 'd' | 'filter'>,
  CoreMapMeshProps {}

export function MapMesh({
  data,
  objectKey,
  filter,
  fill = 'none',
  ...props
}: MapMeshProps): ReactElement | null {
  const context = useMapContext()

  const path = useMemo(
    () => renderMesh(context, data, objectKey, filter) ?? undefined,
    [context, data, objectKey, filter],
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
