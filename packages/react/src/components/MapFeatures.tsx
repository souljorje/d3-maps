'use client'

import type {
  MapFeaturesProps as CoreMapFeaturesProps,
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
import {
  useMemo,
  useRef,
} from 'react'

import { useMapContext } from '../hooks/useMapContext'
import { MapFeature } from './MapFeature'

interface MapFeaturesRenderProps<TExtra extends object = object> {
  features: MapFeatureRendered<TExtra>[]
}

type MapFeaturesChildren<TExtra extends object = object> =
  ReactNode | ((props: MapFeaturesRenderProps<TExtra>) => ReactNode)
type MapFeaturesElementProps = Omit<SVGProps<SVGGElement>, 'children'>

export interface MapFeaturesProps<TExtra extends object = object>
  extends MapFeaturesElementProps,
  CoreMapFeaturesProps<TExtra, CSSProperties> {
  children?: MapFeaturesChildren<TExtra>
  onFeaturesChange?: (features: MapFeatureRendered<TExtra>[]) => void
}

function isRenderProp<TExtra extends object>(
  children: MapFeaturesChildren<TExtra> | undefined,
): children is (props: MapFeaturesRenderProps<TExtra>) => ReactNode {
  return typeof children === 'function'
}

export function MapFeatures<TExtra extends object = object>({
  data,
  objectKey,
  transformer,
  getKey,
  styles,
  children,
  onFeaturesChange,
  ...groupProps
}: MapFeaturesProps<TExtra>): ReactElement {
  const context = useMapContext()

  const features = useMemo(() => {
    return makeMapFeatures<TExtra>(context, {
      data,
      objectKey,
      transformer,
      getKey,
    })
  }, [context, data, objectKey, transformer, getKey])

  const resolvedChildren = isRenderProp(children)
    ? children({ features })
    : children

  // Notify parent synchronously when features change — avoids extra render from useEffect
  const notifiedFeaturesRef = useRef<MapFeatureRendered<TExtra>[] | undefined>(undefined)
  if (features !== notifiedFeaturesRef.current) {
    notifiedFeaturesRef.current = features
    onFeaturesChange?.(features)
  }

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
