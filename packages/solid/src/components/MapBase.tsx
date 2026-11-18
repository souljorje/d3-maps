import type { JSX } from '@solidjs/web'

import type { MapBaseProps } from '../types'

import { makeMapContext } from '@d3-maps/core'
import { createMemo, omit } from 'solid-js'

import { MapContextValue } from '../context'

export function MapBase(props: MapBaseProps): JSX.Element {
  const context = createMemo(() => props.context ?? makeMapContext(props))
  const attributes = omit(props, 'width', 'height', 'aspectRatio', 'projection', 'projectionConfig', 'config', 'fit', 'fitObjectKey', 'padding', 'context', 'class', 'children')

  return (
    <MapContextValue value={context}>
      <svg {...attributes} class={['d3-map', props.class]} viewBox={`0 0 ${context().width} ${context().height}`}>
        {typeof props.children === 'function' ? props.children(context()) : props.children}
      </svg>
    </MapContextValue>
  )
}
