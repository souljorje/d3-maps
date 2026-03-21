import type { MapLineCustomCurve } from './line'
import type { MapObjectProps } from './mapObject'

import {
  getConnectorLinePath,
  getPointsLinePath,
} from './line'
import { makeTransform } from './utils'

export type MapAnnotationCoordinates = [number, number]
export type MapAnnotationCurve = MapLineCustomCurve

export interface MapAnnotationProps<TStyle = unknown> extends MapObjectProps<TStyle> {
  coordinates: MapAnnotationCoordinates
  length?: number
  angle?: number
  margin?: number
  curve?: MapAnnotationCurve
}

export interface MapAnnotationGeometry {
  lineTransform: string
  linePath: string | null
  contentTransform: string
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
  curve,
}: Partial<MapAnnotationProps> = {}): MapAnnotationGeometry {
  const lineEndX = margin + length
  const points: MapAnnotationCoordinates[] = [
    [margin, 0],
    [lineEndX, 0],
  ]

  const linePath = typeof curve === 'number'
    ? getConnectorLinePath(points, curve)
    : getPointsLinePath(points, curve)

  const radians = angle * Math.PI / 180
  const contentX = Math.cos(radians) * lineEndX
  const contentY = Math.sin(radians) * lineEndX

  return {
    lineTransform: `rotate(${angle})`,
    linePath,
    contentTransform: makeTransform(contentX, contentY),
  }
}
