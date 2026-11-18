<script lang='ts'>
  import type { InteractionController, InteractionState } from '@d3-maps/core'

  import type { MapElementProps } from '../types'

  import { resolveInteractionStyle, useInteractionEvents } from '@d3-maps/core'
  import { getContext } from 'svelte'

  import { MAP_ZOOM_CONTEXT } from '../context'

  const { tag = 'path', styles, style, children, ...attributes }: MapElementProps = $props()
  let state = $state<InteractionState>('default')
  let controller: InteractionController<MouseEvent> | undefined
  const isZoomed = Boolean(getContext(MAP_ZOOM_CONTEXT))
  const resolvedStyle = $derived([style, resolveInteractionStyle(state, styles)].filter(Boolean).join(';'))

  $effect(() => {
    if (!tag) return
    const current = useInteractionEvents((next) => {
      state = next
    }, isZoomed)
    controller = current
    state = 'default'
    return () => {
      current.dispose()
      if (controller === current) controller = undefined
    }
  })
</script>

<svelte:element
  this={tag}
  xmlns='http://www.w3.org/2000/svg'
  {...attributes}
  style={resolvedStyle}
  onmouseenter={(event: MouseEvent & { currentTarget: EventTarget & SVGElement }) => {
    controller?.onMouseenter()
    attributes.onmouseenter?.(event)
  }}
  onmouseleave={(event: MouseEvent & { currentTarget: EventTarget & SVGElement }) => {
    controller?.onMouseleave()
    attributes.onmouseleave?.(event)
  }}
  onmousedowncapture={(event: MouseEvent & { currentTarget: EventTarget & SVGElement }) => {
    controller?.onMousedown(event)
  }}
  onmouseupcapture={() => {
    controller?.onMouseup()
  }}
  onfocus={(event: FocusEvent & { currentTarget: EventTarget & SVGElement }) => {
    controller?.onFocus()
    attributes.onfocus?.(event)
  }}
  onblur={(event: FocusEvent & { currentTarget: EventTarget & SVGElement }) => {
    controller?.onBlur()
    attributes.onblur?.(event)
  }}
>
  {@render children?.()}
</svelte:element>
