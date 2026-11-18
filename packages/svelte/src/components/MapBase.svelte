<script lang='ts'>
  import type { MapBaseProps } from '../types'

  import { makeMapContext } from '@d3-maps/core'
  import { setContext } from 'svelte'

  import { MAP_CONTEXT } from '../context'

  const {
    width,
    height,
    aspectRatio,
    projection,
    projectionConfig,
    config,
    fit,
    fitObjectKey,
    padding,
    context: providedContext,
    class: className,
    children,
    ...attributes
  }: MapBaseProps = $props()

  const context = $derived(providedContext ?? makeMapContext({
    width,
    height,
    aspectRatio,
    projection,
    projectionConfig,
    config,
    fit,
    fitObjectKey,
    padding,
  }))
  setContext(MAP_CONTEXT, () => context)
</script>

<svg {...attributes} class={['d3-map', className]} viewBox={`0 0 ${context.width} ${context.height}`}>
  {@render children?.(context)}
</svg>
