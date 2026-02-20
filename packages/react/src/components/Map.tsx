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

import { makeMapContext } from '@d3-maps/core'
import { useMemo } from 'react'

import { MapProvider } from './MapContext'

type MapRenderProp = (context: MapContext) => ReactNode

export interface MapProps
  extends MapConfig,
  Omit<SVGProps<SVGSVGElement>, keyof MapConfig | 'children'> {
  children?: ReactNode | MapRenderProp
}

function isRenderProp(children: MapProps['children']): children is MapRenderProp {
  return typeof children === 'function'
}

export function Map({
  width,
  height,
  aspectRatio,
  projection,
  projectionConfig,
  data,
  dataTransformer,
  children,
  className,
  ...svgProps
}: MapProps): ReactElement {
  const context = useMemo(() => {
    return makeMapContext({
      width,
      height,
      aspectRatio,
      projection,
      projectionConfig,
      data,
      dataTransformer,
    })
  }, [
    width,
    height,
    aspectRatio,
    projection,
    projectionConfig,
    data,
    dataTransformer,
  ])

  const resolvedChildren = isRenderProp(children)
    ? children(context)
    : children

  const mergedClassName = className
    ? `d3-map ${className}`
    : 'd3-map'

  return (
    <MapProvider context={context}>
      <svg
        {...svgProps}
        className={mergedClassName}
        viewBox={`0 0 ${context.width} ${context.height}`}
      >
        {resolvedChildren}
      </svg>
    </MapProvider>
  )
}
