<script lang='ts'>
  import type { MapFeatureProps } from '../types'

  import MapElement from './MapElement.svelte'

  const props: MapFeatureProps = $props()
</script>

<MapElement data-d3m='feature' {...props} />
