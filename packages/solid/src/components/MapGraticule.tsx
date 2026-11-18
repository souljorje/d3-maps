import type { JSX } from '@solidjs/web'

import type { MapGraticuleProps } from '../types'

import { renderGraticule } from '@d3-maps/core'
import { createMemo, omit } from 'solid-js'

import { useMapContext } from '../context'

export function MapGraticule(props: MapGraticuleProps): JSX.Element {
  const context = useMapContext()
  const d = createMemo(() => renderGraticule(context(), props.config) ?? undefined)
  const attributes = omit(props, 'config')
  return <path {...attributes} d={d()} data-d3m="graticule" fill="none" />
}
