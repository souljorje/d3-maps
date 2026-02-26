'use client'

import type {
  ReactElement,
  SVGProps,
} from 'react'

import type { MapObjectStyles } from '../hooks/useMapObject'

import { useMemo } from 'react'

import { useMapContext } from '../hooks/useMapContext'
import { useMapObject } from '../hooks/useMapObject'

export interface MapMeshProps
  extends Omit<SVGProps<SVGPathElement>, 'children' | 'd' | 'style'> {
  styles?: MapObjectStyles
}

export function MapMesh({
  styles,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  ...pathProps
}: MapMeshProps): ReactElement | null {
  const context = useMapContext()

  const path = useMemo(() => {
    return context?.renderMesh() ?? undefined
  }, [context])

  const { style, ...events } = useMapObject<SVGPathElement>({
    styles,
    onMouseEnter,
    onMouseLeave,
    onMouseDown,
    onMouseUp,
  })

  const fill = pathProps.fill ?? 'none'

  return (
    <path
      {...pathProps}
      d={path}
      style={style}
      fill={fill}
      name="mesh"
      {...events}
    />
  )
}
