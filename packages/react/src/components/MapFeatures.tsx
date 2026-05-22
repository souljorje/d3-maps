'use client'

import type {
  MapFeaturesProps as CoreMapFeaturesProps,
  MapFeatureData,
  MapFeatureRendered,
} from '@d3-maps/core'
import type {
  CSSProperties,
  ReactElement,
  ReactNode,
  SVGProps,
} from 'react'

import {
  makeMapFeatures,
} from '@d3-maps/core'
import { useMemo } from 'react'

import { useMapContext } from '../hooks/useMapContext'
import { MapFeature } from './MapFeature'

interface MapFeaturesRenderProps<TFeature extends MapFeatureData = MapFeatureData> {
  features: MapFeatureRendered<TFeature>[]
}

type MapFeaturesChildren<TFeature extends MapFeatureData = MapFeatureData> =
  ReactNode | ((props: MapFeaturesRenderProps<TFeature>) => ReactNode)
type MapFeaturesElementProps = Omit<SVGProps<SVGGElement>, 'children'>

export interface MapFeaturesProps<TFeature extends MapFeatureData = MapFeatureData>
  extends MapFeaturesElementProps,
  CoreMapFeaturesProps<TFeature, CSSProperties> {
  children?: MapFeaturesChildren<TFeature>
}

function isRenderProp<TFeature extends MapFeatureData>(
  children: MapFeaturesChildren<TFeature> | undefined,
): children is (props: MapFeaturesRenderProps<TFeature>) => ReactNode {
  return typeof children === 'function'
}

export function MapFeatures<TFeature extends MapFeatureData = MapFeatureData>({
  data,
  objectKey,
  transformer,
  getKey,
  styles,
  children,
  ...groupProps
}: MapFeaturesProps<TFeature>): ReactElement {
  const context = useMapContext()

  const features = useMemo(() => {
    return makeMapFeatures<TFeature>(context, {
      data,
      objectKey,
      transformer,
      getKey,
    })
  }, [context, data, objectKey, transformer, getKey])

  const resolvedChildren = isRenderProp(children)
    ? children({ features })
    : children

  return (
    <g
      {...groupProps}
      data-d3m="features"
    >
      {
        resolvedChildren
        ?? features.map(({ key, d }) => (
          <MapFeature
            key={key}
            d={d}
            styles={styles}
          />
        ))
      }
    </g>
  )
}
