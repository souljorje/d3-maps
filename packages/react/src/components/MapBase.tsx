'use client'

import type {
  MapContext,
  MapProps,
} from '@d3-maps/core'
import type {
  ReactElement,
  ReactNode,
  SVGProps,
} from 'react'

import { useCreateMapContext } from '../hooks/useCreateMapContext'
import { MapContextValue } from '../hooks/useMapContext'

type MapBaseRenderProp = (context: MapContext) => ReactNode
type BaseMapProps = Omit<SVGProps<SVGSVGElement>, keyof MapProps | 'children'>
type MapConfigProps = MapProps & {
  context?: undefined
}
type MapContextProps = Partial<MapProps> & {
  context: MapContext
}

export type MapBaseProps = BaseMapProps & {
  children?: ReactNode | MapBaseRenderProp
} & (MapConfigProps | MapContextProps)

function isRenderProp(children: MapBaseProps['children']): children is MapBaseRenderProp {
  return typeof children === 'function'
}

export function MapBase(props: MapBaseProps): ReactElement {
  const {
    children,
    className,
    context: providedContext,
    ...svgProps
  } = props

  const resolvedContext = useCreateMapContext(props, providedContext)

  if (!resolvedContext) {
    throw new Error('MapBase requires data or context')
  }

  const resolvedChildren = isRenderProp(children)
    ? children(resolvedContext)
    : children

  const mergedClassName = className
    ? `d3-map ${className}`
    : 'd3-map'

  return (
    <MapContextValue.Provider value={resolvedContext}>
      <svg
        {...svgProps}
        className={mergedClassName}
        viewBox={`0 0 ${resolvedContext.width} ${resolvedContext.height}`}
      >
        {resolvedChildren}
      </svg>
    </MapContextValue.Provider>
  )
}
