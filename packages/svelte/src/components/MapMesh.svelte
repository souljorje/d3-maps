<script lang='ts'>
  import type { MapMeshProps } from '../types'

  import { renderMesh } from '@d3-maps/core'

  import { useMapContext } from '../context'

  const { data, objectKey, filter, fill = 'none', ...attributes }: MapMeshProps = $props()
  const context = useMapContext()
  const d = $derived(renderMesh(context(), data, objectKey, filter) ?? undefined)
</script>

<path data-d3m='mesh' {...attributes} {d} {fill} />
