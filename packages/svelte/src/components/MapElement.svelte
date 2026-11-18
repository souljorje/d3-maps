<script lang='ts'>
  import type { InteractionState } from '@d3-maps/core'

  import type { MapElementProps } from '../types'

  import { bindMapInteraction, resolveInteractionStyle } from '@d3-maps/core'
  import { getContext } from 'svelte'

  import { MAP_ZOOM_CONTEXT } from '../context'

  const { tag = 'path', styles, style, children, ...attributes }: MapElementProps = $props()
  let state = $state<InteractionState>('default')
  const isZoomed = Boolean(getContext(MAP_ZOOM_CONTEXT))
  const resolvedStyle = $derived([style, resolveInteractionStyle(state, styles)].filter(Boolean).join(';'))

  function interact(element: SVGElement) {
    const dispose = bindMapInteraction(element, (next) => {
      state = next
    }, isZoomed)
    return { destroy: dispose }
  }
</script>

<svelte:element this={tag} xmlns='http://www.w3.org/2000/svg' {...attributes} style={resolvedStyle} use:interact>
  {@render children?.()}
</svelte:element>
