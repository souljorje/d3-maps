'use client'

import type {
  MapConfig,
  MapContext,
} from '@d3-maps/core'
import type {
  ReactElement,
  ReactNode,
  SVGProps,
} from 'react'

import { useCreateMapContext } from '../hooks/useCreateMapContext'
import { MapContextValue } from '../hooks/useMapContext'

type MapRenderProp = (context: MapContext) => ReactNode
type BaseMapProps = Omit<SVGProps<SVGSVGElement>, keyof MapConfig | 'children'>
type MapConfigProps = MapConfig & {
  context?: undefined
}
type MapContextProps = Partial<MapConfig> & {
  context: MapContext
}

export type MapProps = BaseMapProps & {
  children?: ReactNode | MapRenderProp
} & (MapConfigProps | MapContextProps)

function isRenderProp(children: MapProps['children']): children is MapRenderProp {
  return typeof children === 'function'
}

export function Map(props: MapProps): ReactElement {
  const {
    children,
    className,
    context: providedContext,
    ...svgProps
  } = props

  const resolvedContext = useCreateMapContext(props, providedContext)

  if (!resolvedContext) {
    throw new Error('Map requires data or context')
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
