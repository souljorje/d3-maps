import type { JSX } from '@solidjs/web'

import type { MapFeaturesProps } from '../types'

import { makeMapFeatures } from '@d3-maps/core'
import { createEffect, createMemo, For, omit } from 'solid-js'

import { useMapContext } from '../context'
import { MapFeature } from './MapFeature'

export function MapFeatures<TExtra extends object = object>(props: MapFeaturesProps<TExtra>): JSX.Element {
  const context = useMapContext()
  const features = createMemo(() => makeMapFeatures<TExtra>(context(), props))
  const attributes = omit(props, 'data', 'objectKey', 'transformer', 'getKey', 'styles', 'children', 'onFeaturesChange')

  createEffect(features, (current) => {
    props.onFeaturesChange?.(current)
  })

  return (
    <g {...attributes} data-d3m="features">
      {props.children
        ? props.children({ features: features() })
        : (
            <For each={features()} keyed={(feature) => feature.key}>
              {(feature) => <MapFeature d={feature().d} styles={props.styles} />}
            </For>
          )}
    </g>
  )
}
