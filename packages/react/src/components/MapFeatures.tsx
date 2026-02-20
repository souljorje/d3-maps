'use client'

import type { MapFeature as D3MapFeature } from '@d3-maps/core'
import type {
  ReactElement,
  ReactNode,
} from 'react'

import { getFeatureKey } from '@d3-maps/core'

import { useMapContext } from './MapContext'
import { MapFeature } from './MapFeature'

interface MapFeaturesRenderProps {
  features: D3MapFeature[]
}

type MapFeaturesChildren = ReactNode | ((props: MapFeaturesRenderProps) => ReactNode)

export interface MapFeaturesProps {
  idKey?: string
  fill?: string
  stroke?: string
  children?: MapFeaturesChildren
}

function isRenderProp(children: MapFeaturesChildren | undefined): children is (props: MapFeaturesRenderProps) => ReactNode {
  return typeof children === 'function'
}

export function MapFeatures({
  idKey = 'id',
  fill,
  stroke,
  children,
}: MapFeaturesProps): ReactElement {
  const context = useMapContext()
  const features = context?.features ?? []

  const resolvedChildren = isRenderProp(children)
    ? children({ features })
    : children

  return (
    <g>
      {
        resolvedChildren
        ?? features.map((feature, index) => (
          <MapFeature
            key={getFeatureKey(feature, idKey, index)}
            data={feature}
            fill={fill}
            stroke={stroke}
          />
        ))
      }
    </g>
  )
}
