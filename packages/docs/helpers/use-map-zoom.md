# useMapZoom

Reads the current zoom state from [MapZoom](/components/map-zoom)  
Use it inside `MapZoom` when you need live zoom values  
Returns `undefined` if used outside `MapZoom`

## Return value

| Adapter | Type |
| --- | --- |
| `@d3-maps/vue` | `UseMapZoomResult \| undefined` with `ComputedRef` state fields |
| `@d3-maps/react` | `UseMapZoomResult \| undefined` |

## State

- `center`
- `zoom`
- `minZoom`
- `maxZoom`
- `zoomToObject(object, callback)`

## `zoomToObject`

Computes a fitted zoom view for the given object and passes the full [`ObjectZoomView`](/api/core/zoom#objectzoomview) to the callback

## Usage

:::tabs key:framework

== Vue

```vue
<script setup lang="ts">
import { useMapZoom } from '@d3-maps/vue'

const zoom = useMapZoom()

function fitFeature(feature) {
  zoom?.zoomToObject(feature, (view) => {
    console.log(view.center, view.zoom)
  })
}
</script>

<template>
  <div v-if="zoom">
    {{ zoom.zoom.value.toFixed(1) }}x
  </div>
</template>
```

== React

```tsx
import { useMapZoom } from '@d3-maps/react'
import type { MapFeature } from '@d3-maps/core'

function ZoomButton({ feature }: { feature: MapFeature }) {
  const zoom = useMapZoom()

  if (!zoom) return null

  return (
    <button
      type="button"
      onClick={() => zoom.zoomToObject(feature, (view) => {
        console.log(view.center, view.zoom)
      })}
    >
      {zoom.zoom.toFixed(1)}x
    </button>
  )
}
```

:::

## Best Practice

- Use `useMapZoom` in components rendered inside `MapZoom`
- Keep `center` and `zoom` controlled in the parent through `MapZoom` props and callbacks
- Use [useMapContext](/helpers/use-map-context) alongside it when controls need map features or the shared path generator
- Use `zoomToObject` to derive a fitted view and hand the resulting `center` and `zoom` back to parent-controlled state
