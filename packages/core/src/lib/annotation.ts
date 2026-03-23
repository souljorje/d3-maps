import type { MapLineCurve, MapLineMidpoint } from './line'
import type { MapObjectProps } from './mapObject'

import { makeTransform } from './utils'

export type MapAnnotationCoordinates = [number, number]

export interface MapAnnotationProps<TStyle = unknown> extends MapObjectProps<TStyle> {
  coordinates: MapAnnotationCoordinates
  length?: number
  angle?: number
  margin?: number
  curve?: MapLineCurve
  midpoint?: MapLineMidpoint
}

export interface MapAnnotationGeometry {
  lineTransform: string
  lineCoordinates: MapAnnotationCoordinates[]
  contentTransform: string
}

export interface MapAnnotationGeometryOptions {
  length?: number
  angle?: number
  margin?: number
}

export const MAP_ANNOTATION_DEFAULTS = {
  length: 30,
  angle: -45,
  margin: 0,
} as const

export function getAnnotationGeometry({
  length = MAP_ANNOTATION_DEFAULTS.length,
  angle = MAP_ANNOTATION_DEFAULTS.angle,
  margin = MAP_ANNOTATION_DEFAULTS.margin,
}: MapAnnotationGeometryOptions = {}): MapAnnotationGeometry {
  const lineEndX = margin + length
  const start = [margin, 0] as [number, number]
  const end = [lineEndX, 0] as [number, number]

  const radians = angle * Math.PI / 180
  const contentX = Math.cos(radians) * lineEndX
  const contentY = Math.sin(radians) * lineEndX

  return {
    lineTransform: `rotate(${angle})`,
    lineCoordinates: [start, end],
    contentTransform: makeTransform(contentX, contentY),
  }
}
