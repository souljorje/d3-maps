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
  fill?: string
  stroke?: string
  styles?: MapObjectStyles
}

export function MapMesh({
  fill = 'none',
  stroke,
  styles,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  onClick,
  onFocus,
  onBlur,
  ...pathProps
}: MapMeshProps): ReactElement | null {
  const context = useMapContext()

  const path = useMemo(() => {
    return context?.renderMesh() ?? null
  }, [context])

  const {
    computedStyle,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
    onClick: handleClick,
    onFocus: handleFocus,
    onBlur: handleBlur,
  } = useMapObject<SVGPathElement>({
    styles,
    onMouseEnter,
    onMouseLeave,
    onMouseDown,
    onMouseUp,
    onClick,
    onFocus,
    onBlur,
  })

  return path
    ? (
        <path
          {...pathProps}
          d={path}
          style={computedStyle}
          fill={fill}
          stroke={stroke}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onClick={handleClick}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      )
    : null
}
