import type { JSX } from '@solidjs/web'

import type { MapMeshProps } from '../types'

import { renderMesh } from '@d3-maps/core'
import { createMemo, omit } from 'solid-js'

import { useMapContext } from '../context'

export function MapMesh(props: MapMeshProps): JSX.Element {
  const context = useMapContext()
  const d = createMemo(() => renderMesh(context(), props.data, props.objectKey, props.filter) ?? undefined)
  const attributes = omit(props, 'data', 'objectKey', 'filter', 'fill')
  return <path data-d3m="mesh" {...attributes} d={d()} fill={props.fill ?? 'none'} />
}
