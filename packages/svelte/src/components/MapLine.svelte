<script lang='ts'>
  import type { MapLineProps } from '../types'

  import { getLinePath } from '@d3-maps/core'

  import { useMapContext } from '../context'
  import MapElement from './MapElement.svelte'

  const { coordinates, cartesian, custom, curve, midpoint, fill = 'none', ...attributes }: MapLineProps = $props()
  const context = useMapContext()
  const d = $derived(getLinePath(context(), { coordinates, cartesian, custom, curve, midpoint }))
</script>

<MapElement data-d3m='line' {...attributes} {d} {fill} />
