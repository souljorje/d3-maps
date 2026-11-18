<script lang='ts'>
  import type { MapSphereProps } from '../types'

  import { renderSphere } from '@d3-maps/core'

  import { useMapContext } from '../context'

  const { noClip = false, fill = 'none', stroke = 'none', children, ...attributes }: MapSphereProps = $props()
  const context = useMapContext()
  const clipId = `d3m-sphere-${$props.id()}`
  const d = $derived(renderSphere(context()) ?? undefined)
</script>

<g data-d3m='sphere' {...attributes}>
  {#if !noClip}
    <defs><clipPath id={clipId}><path {d} /></clipPath></defs>
  {/if}
  <path {d} data-d3m='sphere-background' {fill} pointer-events='none' stroke='none' />
  <g clip-path={noClip ? undefined : `url(#${clipId})`} data-d3m='sphere-content'>
    {@render children?.()}
  </g>
  <path {d} data-d3m='sphere-border' fill='none' pointer-events='none' {stroke} />
</g>
