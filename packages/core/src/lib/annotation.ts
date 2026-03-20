import type { MapContext } from './map'
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
  anchorTransform: string
  connectorTransform: string
  connectorPath: string
  contentTransform: string
}

export const MAP_ANNOTATION_DEFAULTS = {
  length: 30,
  angle: -45,
  margin: 8,
} as const

export function getAnnotationGeometry(
  context: MapContext | undefined,
  coordinates: MapAnnotationCoordinates,
  {
    length = MAP_ANNOTATION_DEFAULTS.length,
    angle = MAP_ANNOTATION_DEFAULTS.angle,
    margin = MAP_ANNOTATION_DEFAULTS.margin,
  }: Omit<MapAnnotationProps, 'coordinates' | 'styles'> = {},
): MapAnnotationGeometry | undefined {
  const projected = context?.projection(coordinates)
  if (!projected) return undefined

  const connectorEndX = margin + length
  const radians = angle * Math.PI / 180
  const contentX = Math.cos(radians) * connectorEndX
  const contentY = Math.sin(radians) * connectorEndX
  const connectorPath = getPointsLinePath([
    [margin, 0],
    [connectorEndX, 0],
  ])
  if (!connectorPath) return undefined

  return {
    anchorTransform: makeTransform(...projected),
    connectorTransform: `rotate(${angle})`,
    connectorPath,
    contentTransform: makeTransform(contentX, contentY),
  }
}
