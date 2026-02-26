'use client'

import type { MapFeature as D3MapFeature } from '@d3-maps/core'
import type {
  ReactElement,
  ReactNode,
} from 'react'

import type { MapObjectStyles } from '../hooks/useMapObject'

import { getFeatureKey } from '@d3-maps/core'

import { useMapContext } from '../hooks/useMapContext'
import { MapFeature } from './MapFeature'

interface MapFeaturesRenderProps {
  features: D3MapFeature[]
}

type MapFeaturesChildren = ReactNode | ((props: MapFeaturesRenderProps) => ReactNode)

export interface MapFeaturesProps {
  idKey?: string
  fill?: string
  stroke?: string
  styles?: MapObjectStyles
  children?: MapFeaturesChildren
}

function isRenderProp(children: MapFeaturesChildren | undefined): children is (props: MapFeaturesRenderProps) => ReactNode {
  return typeof children === 'function'
}

export function MapFeatures({
  idKey = 'id',
  fill,
  stroke,
  styles,
  children,
}: MapFeaturesProps): ReactElement {
  const context = useMapContext()
  const features = context?.features ?? []

  const resolvedChildren = isRenderProp(children)
    ? children({ features })
    : children

  return (
    <g name="features">
      {
        resolvedChildren
        ?? features.map((feature, index) => (
          <MapFeature
            key={getFeatureKey(feature, idKey, index)}
            data={feature}
            fill={fill}
            stroke={stroke}
            styles={styles}
          />
        ))
      }
    </g>
  )
}
