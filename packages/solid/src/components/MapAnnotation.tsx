import type { JSX } from '@solidjs/web'

import type { MapAnnotationProps } from '../types'

import { getAnnotationGeometry } from '@d3-maps/core'
import { createMemo, omit } from 'solid-js'

import { MapLine } from './MapLine'
import { MapMarker } from './MapMarker'

export function MapAnnotation(props: MapAnnotationProps): JSX.Element {
  const geometry = createMemo(() => getAnnotationGeometry(props))
  const attributes = omit(props, 'coordinates', 'length', 'angle', 'margin', 'curve', 'midpoint', 'children')

  return (
    <MapMarker coordinates={props.coordinates} data-d3m="annotation">
      <g transform={geometry().lineTransform}>
        <MapLine {...attributes} coordinates={geometry().lineCoordinates} cartesian curve={props.curve} midpoint={props.midpoint} fill="none" data-d3m="annotation-line" />
      </g>
      <g data-d3m="annotation-content" transform={geometry().contentTransform}>
        {props.children}
      </g>
    </MapMarker>
  )
}
