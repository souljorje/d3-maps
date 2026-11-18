import type { InteractionController, InteractionState } from '@d3-maps/core'
import type { JSX } from '@solidjs/web'

import type { MapElementProps } from '../types'

import { resolveInteractionStyle, useInteractionEvents } from '@d3-maps/core'
import { dynamic } from '@solidjs/web'
import { createEffect, createMemo, createSignal, omit, useContext } from 'solid-js'

import { MapZoomContextValue } from '../context'

function forwardEvent(handler: unknown, event: Event): void {
  if (typeof handler === 'function') handler(event)
  else if (Array.isArray(handler) && typeof handler[0] === 'function') handler[0](handler[1], event)
}

export function MapElement(props: MapElementProps): JSX.Element {
  let element: SVGElement | undefined
  const isZoomed = Boolean(useContext(MapZoomContextValue))
  const [state, setState] = createSignal<InteractionState>('default')
  let controller: InteractionController<MouseEvent> | undefined
  const attributes = omit(props, 'tag', 'styles', 'style', 'ref', 'children', 'onMouseEnter', 'onMouseLeave', 'onMouseDown', 'onMouseUp', 'onFocus', 'onBlur')
  const style = createMemo(() => ({ ...props.style, ...resolveInteractionStyle(state(), props.styles) }))
  const Tag = dynamic(() => props.tag ?? 'path')

  createEffect(
    () => props.tag ?? 'path',
    () => {
      if (!element) return
      const current = useInteractionEvents(setState, isZoomed)
      controller = current
      setState('default')
      return () => {
        current.dispose()
        if (controller === current) controller = undefined
      }
    },
  )

  return (
    <Tag
      {...attributes}
      ref={[(value: SVGElement) => {
        element = value
      }, props.ref]}
      style={style()}
      on:mouseenter={(event: MouseEvent) => {
        controller?.onMouseenter()
        forwardEvent(props.onMouseEnter, event)
      }}
      on:mouseleave={(event: MouseEvent) => {
        controller?.onMouseleave()
        forwardEvent(props.onMouseLeave, event)
      }}
      on:mousedown={(event: MouseEvent) => {
        controller?.onMousedown(event)
        forwardEvent(props.onMouseDown, event)
      }}
      on:mouseup={(event: MouseEvent) => {
        controller?.onMouseup()
        forwardEvent(props.onMouseUp, event)
      }}
      on:focus={(event: FocusEvent) => {
        controller?.onFocus()
        forwardEvent(props.onFocus, event)
      }}
      on:blur={(event: FocusEvent) => {
        controller?.onBlur()
        forwardEvent(props.onBlur, event)
      }}
    >
      {props.children}
    </Tag>
  )
}
