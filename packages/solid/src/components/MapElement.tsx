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
  const isZoomed = Boolean(useContext(MapZoomContextValue))
  const [state, setState] = createSignal<InteractionState>('default')
  let controller: InteractionController<MouseEvent> | undefined
  const attributes = omit(props, 'tag', 'styles', 'style', 'ref', 'children', 'onMouseEnter', 'onMouseLeave', 'onMouseDown', 'onMouseUp', 'onFocus', 'onBlur')
  const style = createMemo(() => ({ ...props.style, ...resolveInteractionStyle(state(), props.styles) }))
  const Tag = dynamic(() => props.tag ?? 'path')

  createEffect(
    () => props.tag ?? 'path',
    () => {
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
      ref={props.ref}
      style={style()}
      onMouseEnter={(event) => { controller?.onMouseenter(); forwardEvent(props.onMouseEnter, event) }}
      onMouseLeave={(event) => { controller?.onMouseleave(); forwardEvent(props.onMouseLeave, event) }}
      onMouseDown={(event) => { controller?.onMousedown(event); forwardEvent(props.onMouseDown, event) }}
      onMouseUp={(event) => { controller?.onMouseup(); forwardEvent(props.onMouseUp, event) }}
      onFocus={(event) => { controller?.onFocus(); forwardEvent(props.onFocus, event) }}
      onBlur={(event) => { controller?.onBlur(); forwardEvent(props.onBlur, event) }}
    >
      {props.children}
    </Tag>
  )
}
