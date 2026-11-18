import type { JSX } from '@solidjs/web'

import type { MapLineProps } from '../types'

import { getLinePath } from '@d3-maps/core'
import { createMemo, omit } from 'solid-js'

import { useMapContext } from '../context'
import { MapElement } from './MapElement'

export function MapLine(props: MapLineProps): JSX.Element {
  const context = useMapContext()
  const d = createMemo(() => getLinePath(context(), props))
  const attributes = omit(props, 'coordinates', 'cartesian', 'custom', 'curve', 'midpoint', 'fill')
  return <MapElement data-d3m="line" {...attributes} d={d()} fill={props.fill ?? 'none'} />
}
