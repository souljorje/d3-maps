import type { MapObjectProps } from './mapObject'

import { getPointsLinePath } from './line'
import { makeTransform } from './utils'

export type MapAnnotationCoordinates = [number, number]

export interface MapAnnotationProps<TStyle = unknown> extends MapObjectProps<TStyle> {
  coordinates: MapAnnotationCoordinates
  length?: number
  angle?: number
  margin?: number
}

export interface MapAnnotationGeometry {
  lineTransform: string
  linePath?: string
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
}: Partial<MapAnnotationProps> = {}): MapAnnotationGeometry {
  const lineEndX = margin + length
  const linePath = getPointsLinePath([
    [margin, 0],
    [lineEndX, 0],
  ])

  const radians = angle * Math.PI / 180
  const contentX = Math.cos(radians) * lineEndX
  const contentY = Math.sin(radians) * lineEndX

  return {
    lineTransform: `rotate(${angle})`,
    linePath,
    contentTransform: makeTransform(contentX, contentY),
  }
}
