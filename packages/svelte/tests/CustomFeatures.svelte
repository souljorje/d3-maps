<script lang='ts'>
  import type { MapFeatureNormalized } from '@d3-maps/core'

  import { sampleGeoJsonTwoFeatures } from '../../../tests/fixtures/mapData'
  import { MapBase, MapFeature, MapFeatures, useMapContext, useMapZoom } from '../src'

  const transformer = (features: readonly MapFeatureNormalized[]) => features.map((feature) => ({ ...feature, score: 42 }))
  // These exports exercise the public hook signatures without calling them outside initialization.
  export const contextHook = useMapContext
  export const zoomHook = useMapZoom
</script>

<MapBase fit={sampleGeoJsonTwoFeatures}>
  <MapFeatures data={sampleGeoJsonTwoFeatures} {transformer} getKey={(feature) => `${feature.score}-${feature.id}`}>
    {#snippet children({ features })}
      {#each features as feature (feature.key)}
        <MapFeature d={feature.d} data-score={feature.score} />
      {/each}
    {/snippet}
  </MapFeatures>
</MapBase>
