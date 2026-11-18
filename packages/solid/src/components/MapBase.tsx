import type { JSX } from '@solidjs/web'

import type { MapBaseProps } from '../types'

import { makeMapContext } from '@d3-maps/core'
import { createMemo, omit } from 'solid-js'

import { MapContextValue } from '../context'

export function MapBase(props: MapBaseProps): JSX.Element {
  // Core copies projection options; never pass component children into that copy.
  const context = createMemo(() => props.context ?? makeMapContext({
    width: props.width,
    height: props.height,
    aspectRatio: props.aspectRatio,
    projection: props.projection,
    projectionConfig: props.projectionConfig,
    config: props.config,
    fit: props.fit,
    fitObjectKey: props.fitObjectKey,
    padding: props.padding,
  }))
  const attributes = omit(props, 'width', 'height', 'aspectRatio', 'projection', 'projectionConfig', 'config', 'fit', 'fitObjectKey', 'padding', 'context', 'class', 'children')

  // Resolve children only under the provider, and read their getter once.
  function Content(): JSX.Element {
    const content = createMemo(() => {
      const child = props.children
      return typeof child === 'function' ? child(context()) : child
    })
    return <>{content()}</>
  }

  return (
    <MapContextValue value={context}>
      <svg {...attributes} class={['d3-map', props.class]} viewBox={`0 0 ${context().width} ${context().height}`}>
        <Content />
      </svg>
    </MapContextValue>
  )
}
