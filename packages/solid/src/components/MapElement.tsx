import type { InteractionEventType, InteractionState } from '@d3-maps/core'
import type { JSX } from '@solidjs/web'
import type { Ref } from 'solid-js'

import type { MapElementProps } from '../types'

import { resolveInteractionStyle, useInteractionEvents } from '@d3-maps/core'
import { dynamic } from '@solidjs/web'
import { createEffect, createMemo, createSignal, omit, useContext } from 'solid-js'

import { MapZoomContextValue } from '../context'

function assignRef(ref: Ref<SVGElement>, element: SVGElement): void {
  if (Array.isArray(ref)) {
    for (const item of ref) assignRef(item, element)
  } else if (typeof ref === 'function') {
    ref(element)
  }
}

function forwardEvent(handler: unknown, event: Event): void {
  if (typeof handler === 'function') handler(event)
  else if (Array.isArray(handler) && typeof handler[0] === 'function') handler[0](handler[1], event)
}

export function MapElement(props: MapElementProps): JSX.Element {
  let element: SVGElement | undefined
  const isZoomed = Boolean(useContext(MapZoomContextValue))
  const [state, setState] = createSignal<InteractionState>('default')
  const attributes = omit(props, 'tag', 'styles', 'style', 'ref', 'children', 'onMouseEnter', 'onMouseLeave', 'onMouseDown', 'onMouseUp', 'onFocus', 'onBlur')
  const style = createMemo(() => ({ ...props.style, ...resolveInteractionStyle(state(), props.styles) }))
  const Tag = dynamic(() => props.tag ?? 'path')

  createEffect(
    () => props.tag ?? 'path',
    () => {
      const node = element
      if (!node) return

      const interaction = useInteractionEvents(setState, isZoomed)
      setState('default')

      // Solid 2 delegates pointer events to its render root. D3 Zoom can
      // consume those events before delegation, so bind native listeners.
      const handlers: Record<InteractionEventType, (event: Event) => void> = {
        mouseenter: (event) => {
          interaction.onMouseenter()
          forwardEvent(props.onMouseEnter, event)
        },
        mouseleave: (event) => {
          interaction.onMouseleave()
          forwardEvent(props.onMouseLeave, event)
        },
        mousedown: (event) => {
          interaction.onMousedown(event)
          forwardEvent(props.onMouseDown, event)
        },
        mouseup: (event) => {
          interaction.onMouseup()
          forwardEvent(props.onMouseUp, event)
        },
        focus: (event) => {
          interaction.onFocus()
          forwardEvent(props.onFocus, event)
        },
        blur: (event) => {
          interaction.onBlur()
          forwardEvent(props.onBlur, event)
        },
      }

      for (const [name, handler] of Object.entries(handlers)) {
        node.addEventListener(name, handler)
      }

      return () => {
        for (const [name, handler] of Object.entries(handlers)) {
          node.removeEventListener(name, handler)
        }
        interaction.dispose()
      }
    },
  )

  return (
    <Tag
      {...attributes}
      ref={(value: SVGElement) => {
        element = value
        assignRef(props.ref, value)
      }}
      style={style()}
    >
      {props.children}
    </Tag>
  )
}
