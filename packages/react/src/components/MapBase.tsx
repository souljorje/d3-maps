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

type MapBaseRenderProp = (context: MapContext) => ReactNode

export interface MapBaseProps
  extends MapConfig,
  Omit<SVGProps<SVGSVGElement>, keyof MapConfig | 'children'> {
  children?: ReactNode | MapBaseRenderProp
}

function isRenderProp(children: MapBaseProps['children']): children is MapBaseRenderProp {
  return typeof children === 'function'
}

export function MapBase({
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
}: MapBaseProps): ReactElement {
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

  return (
    <MapProvider context={context}>
      <svg
        {...svgProps}
        className={`d3-map ${className ?? ''}`}
        viewBox={`0 0 ${context.width} ${context.height}`}
      >
        {resolvedChildren}
      </svg>
    </MapProvider>
  )
}
