import type { MapZoomBinding } from '@d3-maps/core'
import type { JSX } from '@solidjs/web'

import type { MapZoomHandle, MapZoomProps } from '../types'

import { bindMapZoom, createZoomCommandsProxy } from '@d3-maps/core'
import { createEffect, omit, onSettled, untrack } from 'solid-js'

import { MapZoomContextValue, useMapContext } from '../context'

export function MapZoom(props: MapZoomProps): JSX.Element {
  let container: SVGGElement | undefined
  let binding: MapZoomBinding | undefined
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
    ({ context: viewport, ...options }) => {
      if (!container) return
      const current = bindMapZoom(() => viewport, container, () => untrack(() => ({
        ...options,
        transition: props.transition,
        onZoomStart: props.onZoomStart,
        onZoom: props.onZoom,
        onZoomEnd: props.onZoomEnd,
      })))
      binding = current
      return () => {
        current.dispose()
        if (binding === current) binding = undefined
      }
    },
  )

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
