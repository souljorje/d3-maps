'use client'

import type { MapSphereProps as CoreMapSphereProps } from '@d3-maps/core'
import type {
  ReactElement,
  ReactNode,
  SVGProps,
} from 'react'

import { renderSphere } from '@d3-maps/core'
import {
  useId,
  useMemo,
} from 'react'

import { useMapContext } from '../hooks/useMapContext'

export interface MapSphereProps
  extends CoreMapSphereProps,
  Omit<SVGProps<SVGGElement>, 'children' | 'fill' | 'stroke'> {
  children?: ReactNode
}

export function MapSphere({
  children,
  fill = 'none',
  noClip = false,
  stroke = 'none',
  ...props
}: MapSphereProps): ReactElement {
  const context = useMapContext()
  const clipPathId = `d3m-sphere-${useId().replaceAll(':', '')}`

  const path = useMemo(() => {
    return renderSphere(context) ?? undefined
  }, [context])

  return (
    <g
      data-d3m="sphere"
      {...props}
    >
      {
        !noClip && (
          <defs>
            <clipPath id={clipPathId}>
              <path d={path} />
            </clipPath>
          </defs>
        )
      }
      <path
        d={path}
        data-d3m="sphere-background"
        fill={fill}
        pointerEvents="none"
        stroke="none"
      />
      <g
        clipPath={noClip ? undefined : `url(#${clipPathId})`}
        data-d3m="sphere-content"
      >
        {children}
      </g>
      <path
        d={path}
        data-d3m="sphere-border"
        fill="none"
        pointerEvents="none"
        stroke={stroke}
      />
    </g>
  )
}
