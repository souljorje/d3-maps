<script lang='ts'>
  import type { ZoomBinding } from '@d3-maps/core'

  import type { MapZoomHandle, MapZoomProps } from '../types'

  import { createZoomBinding, createZoomCommandsProxy } from '@d3-maps/core'
  import { onMount, setContext } from 'svelte'

  import { MAP_ZOOM_CONTEXT, useMapContext } from '../context'

  const {
    minZoom,
    maxZoom,
    transition,
    config,
    onZoomStart,
    onZoom,
    onZoomEnd,
    onReady,
    children,
    class: className,
    ...attributes
  }: MapZoomProps = $props()
  let container: SVGGElement | undefined = $state()
  let binding: ZoomBinding | undefined
  const context = useMapContext()
  const commands = createZoomCommandsProxy(() => binding?.commands)
  const handle: MapZoomHandle = { ...commands, getContainer, getZoomBehavior }
  setContext(MAP_ZOOM_CONTEXT, handle)

  export const transform = commands.transform
  export const translateBy = commands.translateBy
  export const translateTo = commands.translateTo
  export const scaleBy = commands.scaleBy
  export const scaleTo = commands.scaleTo
  export const scaleWith = commands.scaleWith
  export const zoomToFeature = commands.zoomToFeature
  export const reset = commands.reset
  export function getContainer() {
    return container ?? null
  }
  export function getZoomBehavior() {
    return binding?.zoomBehavior
  }

  function zoom(element: SVGGElement) {
    const current = createZoomBinding(context, element, () => ({
      minZoom,
      maxZoom,
      transition,
      config,
      onZoomStart,
      onZoom,
      onZoomEnd,
    }))
    binding = current
    return {
      destroy() {
        current.dispose()
        if (binding === current) binding = undefined
      },
    }
  }

  $effect(() => {
    if (container) binding?.update()
  })

  onMount(() => {
    onReady?.(handle)
  })
</script>

<g data-d3m='zoom' {...attributes} bind:this={container} use:zoom class={['d3-map-zoom', className]}>
  {@render children?.()}
</g>
