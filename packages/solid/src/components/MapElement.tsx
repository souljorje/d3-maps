import type { InteractionState } from '@d3-maps/core'
import type { JSX } from '@solidjs/web'

import type { MapElementProps } from '../types'

import { bindMapInteraction, resolveInteractionStyle } from '@d3-maps/core'
import { dynamic } from '@solidjs/web'
import { createEffect, createMemo, createSignal, omit, useContext } from 'solid-js'

import { MapZoomContextValue } from '../context'

export function MapElement(props: MapElementProps): JSX.Element {
  let element: SVGElement | undefined
  const isZoomed = Boolean(useContext(MapZoomContextValue))
  const [state, setState] = createSignal<InteractionState>('default')
  const attributes = omit(props, 'tag', 'styles', 'style', 'ref', 'children')
  const style = createMemo(() => ({ ...props.style, ...resolveInteractionStyle(state(), props.styles) }))
  const Tag = dynamic(() => props.tag ?? 'path')

  createEffect(
    () => props.tag ?? 'path',
    () => {
      if (!element) return
      setState('default')
      return bindMapInteraction(element, setState, isZoomed)
    },
  )

  return (
    <Tag
      {...attributes}
      ref={[(value: SVGElement) => {
        element = value
      }, props.ref]}
      style={style()}
    >
      {props.children}
    </Tag>
  )
}
