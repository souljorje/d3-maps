import type { JSX } from '@solidjs/web'

import type { MapMarkerProps } from '../types'

import { getMarkerTransform } from '@d3-maps/core'
import { createMemo, omit, Show } from 'solid-js'

import { useMapContext } from '../context'
import { MapElement } from './MapElement'

export function MapMarker(props: MapMarkerProps): JSX.Element {
  const context = useMapContext()
  const transform = createMemo(() => getMarkerTransform(context(), props.coordinates))
  const attributes = omit(props, 'coordinates', 'children')

  return (
    <Show when={transform()}>
      <MapElement tag="g" data-d3m="marker" {...attributes} transform={transform()}>
        {props.children}
      </MapElement>
    </Show>
  )
}
