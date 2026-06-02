'use client'

import type {
  MapFeatureProps as CoreMapFeatureProps,
} from '@d3-maps/core'
import type {
  CSSProperties,
  ReactElement,
  SVGProps,
} from 'react'

import { MapElement } from './MapElement'

export interface MapFeatureProps
  extends Omit<SVGProps<SVGPathElement>, 'children' | 'd'>,
  CoreMapFeatureProps<CSSProperties> {}

export function MapFeature(props: MapFeatureProps): ReactElement {
  return (
    <MapElement
      data-d3m="feature"
      {...props}
    />
  )
}
