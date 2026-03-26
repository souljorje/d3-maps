'use client'

import type { MapFeatureProps as CoreMapFeatureProps } from '@d3-maps/core'
import type {
  CSSProperties,
  ReactElement,
  SVGProps,
} from 'react'

import { useMemo } from 'react'

import { useMapContext } from '../hooks/useMapContext'
import { useMapObject } from '../hooks/useMapObject'

export interface MapFeatureProps
  extends CoreMapFeatureProps<CSSProperties>,
  Omit<SVGProps<SVGPathElement>, 'children' | 'd' | 'style'> {}

export function MapFeature({
  data,
  styles,
  ...props
}: MapFeatureProps): ReactElement | null {
  const context = useMapContext()

  const path = useMemo(() => {
    return context.path(data) ?? undefined
  }, [context, data])

  const { style, ...events } = useMapObject<SVGPathElement>({
    styles,
    ...props,
  })

  return (
    <path
      {...props}
      d={path}
      style={style}
      name="feature"
      {...events}
    />
  )
}
