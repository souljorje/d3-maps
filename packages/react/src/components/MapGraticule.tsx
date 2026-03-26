'use client'

import type { MapGraticuleProps as CoreMapGraticuleProps } from '@d3-maps/core'
import type {
  CSSProperties,
  ReactElement,
  SVGProps,
} from 'react'

import {
  renderGraticule,
  renderOutline,
} from '@d3-maps/core'
import { useMemo } from 'react'

import { useMapContext } from '../hooks/useMapContext'
import { useMapObject } from '../hooks/useMapObject'

export interface MapGraticuleProps
  extends Omit<SVGProps<SVGPathElement>, 'children' | 'd' | 'style' | 'fill'>,
  CoreMapGraticuleProps<CSSProperties> {}

export function MapGraticule({
  config,
  background,
  border,
  styles,
  ...props
}: MapGraticuleProps): ReactElement | null {
  const context = useMapContext()

  const graticulePath = useMemo(() => {
    return renderGraticule(context, config) ?? undefined
  }, [context, config])

  const showBackground = background === true || typeof background === 'string'
  const showBorder = border === true || typeof border === 'string'
  const backgroundColor = typeof background === 'string' ? background : undefined
  const borderColor = typeof border === 'string' ? border : undefined
  const shouldRenderOutline = showBackground || showBorder

  const outlinePath = useMemo(() => {
    if (!shouldRenderOutline) return undefined
    return renderOutline(context) ?? undefined
  }, [context, shouldRenderOutline])

  const { style, ...events } = useMapObject<SVGPathElement>({
    styles,
    ...props,
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
        {...props}
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
