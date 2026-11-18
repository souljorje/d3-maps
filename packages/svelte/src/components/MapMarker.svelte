<script lang='ts'>
  import type { MapMarkerProps } from '../types'

  import { getMarkerTransform } from '@d3-maps/core'

  import { useMapContext } from '../context'
  import MapElement from './MapElement.svelte'

  const { coordinates, children, ...attributes }: MapMarkerProps = $props()
  const context = useMapContext()
  const transform = $derived(getMarkerTransform(context(), coordinates))
</script>

{#if transform}
  <MapElement tag='g' data-d3m='marker' {...attributes} {transform}>
    {@render children?.()}
  </MapElement>
{/if}
