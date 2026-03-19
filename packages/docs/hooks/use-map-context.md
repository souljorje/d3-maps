# useMapContext

Reads the current map context from [Map](/components/map)

Use it in custom layers when you need the resolved map size, normalized features, or the shared path generator

Returns `undefined` outside `Map`

## Return value

| Adapter | Type |
| --- | --- |
| `@d3-maps/vue` | `ComputedRef<MapContext> \| undefined` |
| `@d3-maps/react` | `MapContext \| undefined` |

See [MapContext API](/api/core/map#mapcontext)

## Usage

:::tabs key:framework

== Vue

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useMapContext } from '@d3-maps/vue'

const context = useMapContext()
const featureCountLabel = computed(() => {
  if (!context) return null
  return `${context.value.features.length} features`
})
</script>

<template>
  <text
    v-if="featureCountLabel"
    x="12"
    y="20"
    font-size="12"
    fill="#111"
  >
    {{ featureCountLabel }}
  </text>
</template>
```

== React

```tsx
import { useMapContext } from '@d3-maps/react'

function FeatureCountLabel() {
  const context = useMapContext()
  if (!context) return null

  return (
    <text x={12} y={20} fontSize={14} fill="#111">
      {context.features.length} features
    </text>
  )
}
```

:::

## Best Practice

- Use `useMapContext` in components rendered inside `Map`
- Use `Map` slot/render-prop context when that already gives you what you need
