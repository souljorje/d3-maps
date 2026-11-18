<script lang='ts'>
  import type { MapGraticuleProps } from '../types'

  import { renderGraticule } from '@d3-maps/core'

  import { useMapContext } from '../context'

  const { config, ...attributes }: MapGraticuleProps = $props()
  const context = useMapContext()
  const d = $derived(renderGraticule(context(), config) ?? undefined)
</script>

<path {...attributes} {d} data-d3m='graticule' fill='none' />
