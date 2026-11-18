<script lang='ts' generics="TExtra extends object = object">
  import type { MapFeaturesProps } from '../types'

  import { makeMapFeatures } from '@d3-maps/core'
  import { untrack } from 'svelte'

  import { useMapContext } from '../context'
  import MapFeature from './MapFeature.svelte'

  const { data, objectKey, transformer, getKey, styles, children, onFeaturesChange, ...attributes }: MapFeaturesProps<TExtra> = $props()
  const context = useMapContext()
  const features = $derived(makeMapFeatures<TExtra>(context(), { data, objectKey, transformer, getKey }))

  $effect(() => {
    const current = features
    untrack(() => onFeaturesChange?.(current))
  })
</script>

<g {...attributes} data-d3m='features'>
  {#if children}
    {@render children({ features })}
  {:else}
    {#each features as feature (feature.key)}
      <MapFeature d={feature.d} {styles} />
    {/each}
  {/if}
</g>
