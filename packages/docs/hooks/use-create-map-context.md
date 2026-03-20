# useCreateMapContext

Creates a reusable map context in the parent

Use it when `MapBase` and sibling UI should share the same resolved map state

## Return value

| Adapter | Type |
| --- | --- |
| `@d3-maps/vue` | `ComputedRef<MapContext \| undefined>` |
| `@d3-maps/react` | `MapContext \| undefined` |

See [MapContext API](/api/core/map#mapcontext)

## Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `config?` | `MapProps` | Used to create a new context when `context` is not provided |

## Usage

Create the context once in the parent, pass it to sibling UI by prop, and pass the same object into `MapBase`

:::tabs key:framework

== Vue

```vue
<script setup lang="ts">
import type { MapData } from '@d3-maps/core'

import { computed } from 'vue'
import { useCreateMapContext } from '@d3-maps/vue'

const props = defineProps<{
  data: MapData
}>()

const context = useCreateMapContext(computed(() => ({
  data: props.data,
  width: 420,
})))
</script>

<template>
  <Toolbar :context="context" />
  <MapBase :context="context">
    <MapFeatures />
  </MapBase>
</template>
```

== React

```tsx
import type { MapData } from '@d3-maps/core'

import { MapBase, MapFeatures, useCreateMapContext } from '@d3-maps/react'

export function Example({ data }: { data: MapData }) {
  const context = useCreateMapContext({
    data,
    width: 420,
  })

  if (!context) return null

  return (
    <>
      <Toolbar context={context} />
      <MapBase context={context}>
        <MapFeatures />
      </MapBase>
    </>
  )
}
```

:::

If neither `config.data` nor `context` is available yet, the hook returns `undefined`

## Best Practice

- Use `useCreateMapContext` in the parent when controls, toolbars, or other sibling UI need the same map context as `MapBase`
- Use [useMapContext](/hooks/use-map-context) inside custom layers rendered under `MapBase`
- Use `MapBase` slot or render-prop context when that already gives you what you need
