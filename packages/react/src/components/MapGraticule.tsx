'use client'

import type { GraticuleConfig } from '@d3-maps/core'
import type {
  ReactElement,
  SVGProps,
} from 'react'

import type { MapObjectStyles } from '../hooks/useMapObject'

import {
  renderGraticule,
  renderOutline,
} from '@d3-maps/core'
import { useMemo } from 'react'

import { useMapContext } from '../hooks/useMapContext'
import { useMapObject } from '../hooks/useMapObject'

export interface MapGraticuleProps
  extends Omit<SVGProps<SVGPathElement>, 'children' | 'd' | 'style' | 'fill'> {
  config?: GraticuleConfig
  background?: boolean | string
  border?: boolean | string
  stroke?: string
  styles?: MapObjectStyles
}

export function MapGraticule({
  config,
  background,
  border,
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
}: MapGraticuleProps): ReactElement | null {
  const context = useMapContext()

  const graticulePath = useMemo(() => {
    return context ? renderGraticule(context, config) : null
  }, [context, config])

  const showBackground = background === true || typeof background === 'string'
  const showBorder = border === true || typeof border === 'string'
  const backgroundColor = typeof background === 'string' ? background : undefined
  const borderColor = typeof border === 'string' ? border : undefined
  const shouldRenderOutline = showBackground || showBorder

  const outlinePath = useMemo(() => {
    if (!context || !shouldRenderOutline) return null
    return renderOutline(context)
  }, [context, shouldRenderOutline])

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

  return graticulePath
    ? (
        <g>
          {showBackground && outlinePath
            ? (
                <path
                  d={outlinePath}
                  fill={backgroundColor}
                  name="background"
                  pointerEvents="none"
                />
              )
            : null}
          <path
            {...pathProps}
            d={graticulePath}
            style={computedStyle}
            fill="none"
            stroke={stroke}
            name="graticule"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onClick={handleClick}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          {showBorder && outlinePath
            ? (
                <path
                  d={outlinePath}
                  fill="none"
                  stroke={borderColor}
                  name="border"
                  pointerEvents="none"
                />
              )
            : null}
        </g>
      )
    : null
}
