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
  styles?: MapObjectStyles
}

export function MapGraticule({
  config,
  background,
  border,
  styles,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  ...pathProps
}: MapGraticuleProps): ReactElement | null {
  const context = useMapContext()

  const graticulePath = useMemo(() => {
    if (!context) return undefined
    return renderGraticule(context, config) ?? undefined
  }, [context, config])

  const showBackground = background === true || typeof background === 'string'
  const showBorder = border === true || typeof border === 'string'
  const backgroundColor = typeof background === 'string' ? background : undefined
  const borderColor = typeof border === 'string' ? border : undefined
  const shouldRenderOutline = showBackground || showBorder

  const outlinePath = useMemo(() => {
    if (!context || !shouldRenderOutline) return undefined
    return renderOutline(context) ?? undefined
  }, [context, shouldRenderOutline])

  const { style, ...events } = useMapObject<SVGPathElement>({
    styles,
    onMouseEnter,
    onMouseLeave,
    onMouseDown,
    onMouseUp,
  })

  return (
    <g>
      {showBackground
        ? (
            <path
              d={outlinePath ?? undefined}
              fill={backgroundColor}
              name="background"
              pointerEvents="none"
            />
          )
        : null}
      <path
        {...pathProps}
        d={graticulePath ?? undefined}
        style={style}
        fill="none"
        name="graticule"
        {...events}
      />
      {showBorder
        ? (
            <path
              d={outlinePath ?? undefined}
              fill="none"
              stroke={borderColor}
              name="border"
              pointerEvents="none"
            />
          )
        : null}
    </g>
  )
}
