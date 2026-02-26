'use client'

import type { MapMarkerProps as CoreMapMarkerProps } from '@d3-maps/core'
import type {
  CSSProperties,
  ReactElement,
  SVGProps,
} from 'react'

import { getMarkerTransform } from '@d3-maps/core'
import { useMemo } from 'react'

import { useMapContext } from '../hooks/useMapContext'
import { useMapObject } from '../hooks/useMapObject'

const DEFAULT_COORDINATES: [number, number] = [0, 0]

export interface MapMarkerProps
  extends CoreMapMarkerProps<CSSProperties>,
  Omit<SVGProps<SVGGElement>, 'style'> {}

export function MapMarker({
  coordinates = DEFAULT_COORDINATES,
  styles,
  children,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  onClick,
  onFocus,
  onBlur,
  ...groupProps
}: MapMarkerProps): ReactElement {
  const context = useMapContext()

  const transform = useMemo(() => {
    return getMarkerTransform(context, coordinates)
  }, [
    context,
    coordinates[0],
    coordinates[1],
  ])

  const {
    computedStyle,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
    onClick: handleClick,
    onFocus: handleFocus,
    onBlur: handleBlur,
  } = useMapObject<SVGGElement>({
    styles,
    onMouseEnter,
    onMouseLeave,
    onMouseDown,
    onMouseUp,
    onClick,
    onFocus,
    onBlur,
  })

  return (
    <g
      {...groupProps}
      transform={transform}
      style={computedStyle}
      name="marker"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {children}
    </g>
  )
}
