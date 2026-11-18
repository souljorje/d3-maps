<script lang='ts'>
  import type { MapContext, MapData, MapFeatureRendered } from '@d3-maps/core'

  import type { MapZoomHandle } from '../src'

  import { sampleGeoJsonTwoFeatures, sampleTopology } from '../../../tests/fixtures/mapData'
  import {
    MapAnnotation,
    MapBase,
    MapElement,
    MapFeatures,
    MapGraticule,
    MapLine,
    MapMarker,
    MapMesh,
    MapSphere,
    MapZoom,
  } from '../src'

  const {
    width = 600,
    data = sampleGeoJsonTwoFeatures,
    context,
    maxZoom = 8,
    noClip = false,
    onReady,
    onFeaturesChange,
    onmouseenter,
  }: {
    width?: number
    data?: MapData
    context?: MapContext
    maxZoom?: number
    noClip?: boolean
    onReady?: (zoom: MapZoomHandle) => void
    onFeaturesChange?: (features: MapFeatureRendered[]) => void
    onmouseenter?: (event: MouseEvent) => void
  } = $props()
</script>

<MapBase {width} {context} fit={data} padding={10} aria-label='Test map' class='custom-map'>
  <MapSphere {noClip} fill='white' stroke='black'>
    <MapZoom {maxZoom} {onReady}>
      <MapFeatures {data} {onFeaturesChange} styles={{ default: 'fill: gray' }} />
      <MapGraticule />
      <MapMesh data={sampleTopology} objectKey='demo' />
      <MapMarker coordinates={[5, 5]}><circle r={3} /></MapMarker>
      <MapLine coordinates={[[0, 0], [10, 10]]} />
      <MapAnnotation coordinates={[5, 5]} length={40} angle={45} margin={4}><text>Anchor</text></MapAnnotation>
      <MapElement
        data-testid='interactive'
        d='M0,0L1,1'
        tabindex={0}
        style='fill: orange; opacity: 0.95'
        styles={{ default: 'opacity: 0.9', hover: 'opacity: 0.8', active: 'opacity: 0.7', focus: 'opacity: 0.6' }}
        {onmouseenter}
      />
    </MapZoom>
  </MapSphere>
  <MapSphere noClip />
</MapBase>
