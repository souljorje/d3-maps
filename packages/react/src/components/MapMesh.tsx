'use client'

import type { MapObjectStyles } from '@d3-maps/core'
import type {
  CSSProperties,
  ReactElement,
  SVGProps,
} from 'react'

import { useMemo } from 'react'

import { useMapObject } from '../lib/useMapObject'
import { useMapContext } from './MapContext'

export interface MapMeshProps
  extends Omit<SVGProps<SVGPathElement>, 'children' | 'd' | 'style'> {
  fill?: string
  stroke?: string
  styles?: MapObjectStyles<CSSProperties>
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
  } = useMapObject<SVGPathElement, CSSProperties>({
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
