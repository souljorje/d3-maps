'use client'

import type { MapFeatureProps as CoreMapFeatureProps } from '@d3-maps/core'
import type {
  CSSProperties,
  ReactElement,
  SVGProps,
} from 'react'

import { useMemo } from 'react'

import { useMapContext } from '../hooks/useMapContext'
import { useMapObject } from '../hooks/useMapObject'

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
    return context?.path(data) ?? null
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
          name="feature"
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
