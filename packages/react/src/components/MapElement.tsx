'use client'

import type { MapElementProps as CoreMapElementProps } from '@d3-maps/core'
import type {
  CSSProperties,
  ReactElement,
  ReactNode,
  SVGProps,
} from 'react'

import { useInteraction } from '../hooks/useInteraction'

interface MapElementBaseProps extends CoreMapElementProps<CSSProperties> {
  name?: string
}

interface MapElementPathProps
  extends Omit<SVGProps<SVGPathElement>, 'children' | 'd' | 'style'>,
  MapElementBaseProps {
  tag?: 'path'
  d?: string
}

interface MapElementGroupProps
  extends Omit<SVGProps<SVGGElement>, 'style'>,
  MapElementBaseProps {
  tag: 'g'
  children?: ReactNode
}

export type MapElementProps = MapElementPathProps | MapElementGroupProps

export function MapElement(props: MapElementProps): ReactElement | null {
  if (props.tag === 'g') {
    const {
      tag: _tag,
      styles,
      children,
      name,
      ...groupProps
    } = props
    const { style, ...events } = useInteraction<SVGGElement>({
      styles,
      ...groupProps,
    })

    return (
      <g
        {...groupProps}
        style={style}
        name={name}
        {...events}
      >
        {children}
      </g>
    )
  }

  const {
    tag: _tag,
    d,
    styles,
    name,
    ...pathProps
  } = props
  const { style, ...events } = useInteraction<SVGPathElement>({
    styles,
    ...pathProps,
  })

  return (
    <path
      {...pathProps}
      d={d}
      style={style}
      name={name}
      {...events}
    />
  )
}
