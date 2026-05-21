'use client'

import type { MapObjectProps as CoreMapObjectProps } from '@d3-maps/core'
import type {
  CSSProperties,
  ReactElement,
  ReactNode,
  SVGProps,
} from 'react'

import { useInteraction } from '../hooks/useInteraction'

interface MapObjectBaseProps extends CoreMapObjectProps<CSSProperties> {
  name?: string
}

interface MapObjectPathProps
  extends Omit<SVGProps<SVGPathElement>, 'children' | 'd' | 'style'>,
  MapObjectBaseProps {
  tag?: 'path'
  d?: string
}

interface MapObjectGroupProps
  extends Omit<SVGProps<SVGGElement>, 'style'>,
  MapObjectBaseProps {
  tag: 'g'
  children?: ReactNode
}

export type MapObjectProps = MapObjectPathProps | MapObjectGroupProps

export function MapObject(props: MapObjectProps): ReactElement | null {
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
