import type { ZoomBinding } from '@d3-maps/core'
import type { JSX } from '@solidjs/web'

import type { MapZoomHandle, MapZoomProps } from '../types'

import { createZoomBinding, createZoomCommandsProxy } from '@d3-maps/core'
import { createEffect, omit, onCleanup, onSettled, untrack } from 'solid-js'

import { MapZoomContextValue, useMapContext } from '../context'

export function MapZoom(props: MapZoomProps): JSX.Element {
  let container: SVGGElement | undefined
  let binding: ZoomBinding | undefined
  const context = useMapContext()
  const commands = createZoomCommandsProxy(() => binding?.commands)
  const handle: MapZoomHandle = {
    ...commands,
    getContainer: () => binding ? container ?? null : null,
    getZoomBehavior: () => binding?.zoomBehavior,
  }
  const attributes = omit(props, 'minZoom', 'maxZoom', 'transition', 'config', 'onZoomStart', 'onZoom', 'onZoomEnd', 'onReady', 'ref', 'class', 'children')

  createEffect(
    () => ({ context: context(), minZoom: props.minZoom, maxZoom: props.maxZoom, config: props.config }),
    () => {
      if (!container) return
      if (binding) {
        untrack(() => binding!.update())
      } else {
        binding = createZoomBinding(context, container, () => untrack(() => ({
          minZoom: props.minZoom,
          maxZoom: props.maxZoom,
          config: props.config,
          transition: props.transition,
          onZoomStart: props.onZoomStart,
          onZoom: props.onZoom,
          onZoomEnd: props.onZoomEnd,
        })))
      }
    },
  )

  onCleanup(() => {
    binding?.dispose()
    binding = undefined
  })

  onSettled(() => {
    props.onReady?.(handle)
  })

  return (
    <MapZoomContextValue value={handle}>
      <g
        data-d3m="zoom"
        {...attributes}
        ref={[(value: SVGGElement) => {
          container = value
        }, props.ref]}
        class={['d3-map-zoom', props.class]}
      >
        {props.children}
      </g>
    </MapZoomContextValue>
  )
}
