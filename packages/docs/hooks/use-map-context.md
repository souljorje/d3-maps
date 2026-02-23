# useMapContext

Reads the current map context from [Map](/components/map).

Returns `undefined` outside `Map`.

## Usage

:::tabs key:framework

== Vue

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useMapContext } from '@d3-maps/vue'

const context = useMapContext()
const meshPath = computed(() => context?.renderMesh() ?? null)
</script>

<template>
  <path
    v-if="meshPath"
    :d="meshPath"
    fill="none"
    stroke="#fff"
  />
</template>
```

== React

```tsx
import type { MapData } from '@d3-maps/core'

import { Map, MapFeatures, useMapContext } from '@d3-maps/react'

function MeshOutline() {
  const context = useMapContext()
  const meshPath = context?.renderMesh()

  return meshPath
    ? <path d={meshPath} fill="none" stroke="#fff" />
    : null
}

export function Example({ data }: { data: MapData }) {
  return (
    <Map data={data}>
      <MapFeatures />
      <MeshOutline />
    </Map>
  )
}
```

:::
