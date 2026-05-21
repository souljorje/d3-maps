'use client'

import type {
  MapFeaturesProps as CoreMapFeaturesProps,
  MapFeature,
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
import { MapObject } from './MapObject'

interface MapFeaturesRenderProps {
  features: MapFeature[]
}

type MapFeaturesChildren = ReactNode | ((props: MapFeaturesRenderProps) => ReactNode)
type MapFeaturesElementProps = Omit<SVGProps<SVGGElement>, 'children'>

export interface MapFeaturesProps
  extends MapFeaturesElementProps,
  CoreMapFeaturesProps<CSSProperties> {
  children?: MapFeaturesChildren
}

function isRenderProp(children: MapFeaturesChildren | undefined): children is (props: MapFeaturesRenderProps) => ReactNode {
  return typeof children === 'function'
}

export function MapFeatures({
  data,
  objectKey,
  transformer,
  getKey,
  styles,
  children,
  ...groupProps
}: MapFeaturesProps): ReactElement {
  const context = useMapContext()

  const features = useMemo(() => {
    return makeMapFeatures(context, {
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
      name="features"
    >
      {
        resolvedChildren
        ?? features.map(({ key, d }) => (
          <MapObject
            key={key}
            d={d}
            styles={styles}
            name="feature"
          />
        ))
      }
    </g>
  )
}
