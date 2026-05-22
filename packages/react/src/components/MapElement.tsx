'use client'

import type { MapElementProps as CoreMapElementProps } from '@d3-maps/core'
import type {
  CSSProperties,
  ReactElement,
  ReactNode,
  SVGProps,
} from 'react'

import { useInteraction } from '../hooks/useInteraction'

type MapElementBaseProps = CoreMapElementProps<CSSProperties>

interface MapElementPathProps
  extends Omit<SVGProps<SVGPathElement>, 'children' | 'd'>,
  MapElementBaseProps {
  tag?: 'path'
  d?: string
}

interface MapElementGroupProps
  extends SVGProps<SVGGElement>,
  MapElementBaseProps {
  tag: 'g'
  children?: ReactNode
}

export type MapElementProps = MapElementPathProps | MapElementGroupProps

export function MapElement(props: MapElementProps): ReactElement {
  const {
    tag = 'path',
    styles,
    style: baseStyle,
    ...elementProps
  } = props
  const { style: interactionStyle, ...events } = useInteraction<Element>({
    styles,
    ...elementProps,
  })
  const style = {
    ...baseStyle,
    ...interactionStyle,
  }

  if (tag === 'g') {
    return (
      <g
        {...elementProps as MapElementGroupProps}
        style={style}
        {...events}
      />
    )
  }

  return (
    <path
      {...elementProps as MapElementPathProps}
      style={style}
      {...events}
    />
  )
}
