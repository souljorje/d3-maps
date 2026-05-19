'use client'

import type { MapMeshProps as CoreMapMeshProps } from '@d3-maps/core'
import type {
  CSSProperties,
  ReactElement,
  SVGProps,
} from 'react'

import {
  makeMesh,
  resolveMapDataRef,
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

  const path = useMemo(() => {
    const [resolvedData, resolvedObjectKey] = resolveMapDataRef(
      { data, objectKey },
      context,
    )
    const meshData = makeMesh(resolvedData, resolvedObjectKey)
    return meshData == null ? undefined : context.path(meshData) ?? undefined
  }, [context, data, objectKey])

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
