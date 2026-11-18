<script lang='ts'>
  import type { MapAnnotationProps } from '../types'

  import { getAnnotationGeometry } from '@d3-maps/core'

  import MapLine from './MapLine.svelte'
  import MapMarker from './MapMarker.svelte'

  const { coordinates, length, angle, margin, curve, midpoint, children, ...attributes }: MapAnnotationProps = $props()
  const geometry = $derived(getAnnotationGeometry({ length, angle, margin }))
</script>

<MapMarker {coordinates} data-d3m='annotation'>
  <g transform={geometry.lineTransform}>
    <MapLine {...attributes} coordinates={geometry.lineCoordinates} cartesian {curve} {midpoint} fill='none' data-d3m='annotation-line' />
  </g>
  <g data-d3m='annotation-content' transform={geometry.contentTransform}>
    {@render children?.()}
  </g>
</MapMarker>
