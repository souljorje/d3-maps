'use client'

import type {
  MapGeometriesProps as CoreMapGeometriesProps,
  RenderedGeometry,
} from '@d3-maps/core'
import type {
  CSSProperties,
  ReactElement,
  ReactNode,
  SVGProps,
} from 'react'

import { useMapContext } from '../hooks/useMapContext'
import { MapObject } from './MapObject'

interface MapGeometriesRenderProps {
  geometries: RenderedGeometry[]
}

type MapGeometriesChildren = ReactNode | ((props: MapGeometriesRenderProps) => ReactNode)
type MapGeometriesElementProps = Omit<SVGProps<SVGGElement>, 'children'>

export interface MapGeometriesProps
  extends MapGeometriesElementProps,
  CoreMapGeometriesProps<CSSProperties> {
  children?: MapGeometriesChildren
}

function isRenderProp(children: MapGeometriesChildren | undefined): children is (props: MapGeometriesRenderProps) => ReactNode {
  return typeof children === 'function'
}

export function MapGeometries({
  styles,
  children,
  ...groupProps
}: MapGeometriesProps): ReactElement {
  const context = useMapContext()
  const geometries = context.geometries

  const resolvedChildren = isRenderProp(children)
    ? children({ geometries })
    : children

  return (
    <g
      {...groupProps}
      name="geometries"
    >
      {
        resolvedChildren
        ?? geometries.map(({ key, d }) => (
          <MapObject
            key={key}
            d={d}
            styles={styles}
            name="geometry"
          />
        ))
      }
    </g>
  )
}
