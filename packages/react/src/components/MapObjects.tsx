'use client'

import type {
  MapObjectsProps as CoreMapObjectsProps,
  MapObjectData,
} from '@d3-maps/core'
import type {
  CSSProperties,
  ReactElement,
  ReactNode,
  SVGProps,
} from 'react'

import {
  makeMapObjects,
  resolveMapData,
  resolveMapDataRef,
} from '@d3-maps/core'
import { useMemo } from 'react'

import { useMapContext } from '../hooks/useMapContext'
import { MapObject } from './MapObject'

interface MapObjectsRenderProps {
  objects: MapObjectData[]
}

type MapObjectsChildren = ReactNode | ((props: MapObjectsRenderProps) => ReactNode)
type MapObjectsElementProps = Omit<SVGProps<SVGGElement>, 'children'>

export interface MapObjectsProps
  extends MapObjectsElementProps,
  CoreMapObjectsProps<CSSProperties> {
  children?: MapObjectsChildren
}

function isRenderProp(children: MapObjectsChildren | undefined): children is (props: MapObjectsRenderProps) => ReactNode {
  return typeof children === 'function'
}

export function MapObjects({
  data,
  objectKey,
  dataTransformer,
  getKey,
  styles,
  children,
  ...groupProps
}: MapObjectsProps): ReactElement {
  const context = useMapContext()

  const objects = useMemo(() => {
    if (data == null && objectKey == null && dataTransformer == null && getKey == null) {
      return context.objects
    }

    const [resolvedData, resolvedObjectKey] = resolveMapDataRef(
      { data, objectKey },
      context,
    )
    if (resolvedData == null) return []

    const objectData = resolveMapData(
      resolvedData,
      resolvedObjectKey,
      dataTransformer,
    )

    return makeMapObjects(objectData, context.path, getKey)
  }, [context, data, objectKey, dataTransformer, getKey])

  const resolvedChildren = isRenderProp(children)
    ? children({ objects })
    : children

  return (
    <g
      {...groupProps}
      name="objects"
    >
      {
        resolvedChildren
        ?? objects.map(({ key, d }) => (
          <MapObject
            key={key}
            d={d}
            styles={styles}
            name="object"
          />
        ))
      }
    </g>
  )
}
