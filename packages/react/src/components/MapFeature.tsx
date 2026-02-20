'use client'

import type { MapFeatureProps as CoreMapFeatureProps } from '@d3-maps/core'
import type {
  CSSProperties,
  ReactElement,
  SVGProps,
} from 'react'

import { useMemo } from 'react'

import { useMapObject } from '../lib/useMapObject'
import { useMapContext } from './MapContext'

export interface MapFeatureProps
  extends CoreMapFeatureProps<CSSProperties>,
  Omit<SVGProps<SVGPathElement>, 'children' | 'd' | 'style'> {}

export function MapFeature({
  data,
  styles,
  fill,
  stroke,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  onClick,
  onFocus,
  onBlur,
  ...pathProps
}: MapFeatureProps): ReactElement | null {
  const context = useMapContext()

  const path = useMemo(() => {
    return context?.renderPath(data) ?? null
  }, [context, data])

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
