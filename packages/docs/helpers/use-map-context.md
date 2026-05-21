---
description: Helper for reading map size, projection, and path state inside custom D3 SVG map layers with React and Vue
---

# useMapContext

Reads the current map context from [MapBase](/components/map-base)  
Use it in custom layers when you need the resolved map size, projection, or shared path generator  
Throws an error if used outside `MapBase`

## Return value

| Adapter | Type |
| --- | --- |
| `@d3-maps/vue` | `ComputedRef<MapContext>` |
| `@d3-maps/react` | `MapContext` |

See [MapContext API](/api/core/map#mapcontext)

## Usage

:::tabs key:framework

== Vue

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useMapContext } from '@d3-maps/vue'

const context = useMapContext()
const sizeLabel = computed(() => `${context.value.width}x${context.value.height}`)
</script>

<template>
  <text x="12" y="20" font-size="12" fill="#111">
    {{ sizeLabel }}
  </text>
</template>
```

== React

```tsx
import { useMapContext } from '@d3-maps/react'

function SizeLabel() {
  const context = useMapContext()

  return (
    <text x={12} y={20} fontSize={14} fill="#111">
      {context.width}x{context.height}
    </text>
  )
}
```

:::

## Best Practice

- Use `useMapContext` in components rendered inside `MapBase`
- Pass data explicitly to built-in layers and custom data layers
- Use `MapBase` slot or render-prop context when that already gives you what you need
- Use [useCreateMapContext](/helpers/use-create-map-context) in the parent and pass the same `context` object to both `MapBase` and any sibling UI that needs it
