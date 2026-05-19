---
description: Component for the root D3 SVG map container and shared map context in React and Vue
---

# MapBase

Renders the root `<svg>` and provides a reactive map context to children.

## Props

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `data?` | [MapDataSource](/api/core/data#MapDataSource) | — | Shared GeoJSON or TopoJSON source for layers and default fitting |
| `objectKey?` | `string` | — | TopoJSON object key for `data` |
| `fit?` | [MapFit](/api/core/map#mapfit) | `data` or `sphere` | Built-in fit source. Uses `data` when present, otherwise `sphere` |
| `fitObjectKey?` | `string` | — | TopoJSON object key used when `fit` is an explicit topology |
| `width?` | `number` | `600` |  |
| `height?` | `number` | `width/aspectRatio` |  |
| `aspectRatio?` | `number` | `2 / 1` | Used to derive `height` when `height` is not provided. |
| `projection?` | `() => GeoProjection` | `geoNaturalEarth1` | d3-geo projection factory |
| `projectionConfig?` | [ProjectionConfig](/api/core/map#projectionconfig) | — | See the [guide](#projectionconfig) below |
| `dataTransformer?` | [MapDataTransformer](/api/core/data#mapdatatransformer) | — | Optional transform applied to normalized objects before rendering |
| `context?` | [MapContext](/api/core/map#mapcontext) | — | Optional externally created context. When provided, `MapBase` uses it instead of creating one from props, and `data` is not required |

### projectionConfig

Use `projectionConfig` to call projection methods before rendering

<!--@include: ./_modifiers-args-shape.md-->

See available methods in [d3-geo projection docs](https://d3js.org/d3-geo/projection)  
and usage example below

::: details Core defaults

```ts
fit ?? data ?? 'sphere'
fit === 'data' // fit shared map data after dataTransformer
fit === 'sphere' // fit sphere
fit === 'manual' // skip implicit fitting
fit === mapData // fit explicit GeoJSON or TopoJSON
projectionConfig.padding ?? 1
projectionConfig.fitExtent / fitSize / fitWidth / fitHeight // explicit fit methods still win
projectionConfig.precision ?? 0.2
```

Source: [packages/core/src/lib/map.ts](https://github.com/souljorje/d3-maps/blob/main/packages/core/src/lib/map.ts) (makeProjection)

:::

Built-in fit modes:

- `fit: 'sphere'` keeps the world-map default
- `fit: 'data'` fits `MapBase.data` with `MapBase.objectKey`
- `fit: 'manual'` skips implicit fitting and uses the projection config as-is
- `fit={mapData}` fits an explicit GeoJSON or TopoJSON source and uses `fitObjectKey` for TopoJSON selection
- `padding` controls the inset used by built-in fit modes
- explicit `fitExtent`, `fitSize`, `fitWidth`, and `fitHeight` override `fit`

## Usage

:::tabs key:framework

== Vue

```vue
<script setup lang="ts">
import { geoEquirectangular } from 'd3-geo'
import { type MapDataSource } from '@d3-maps/vue'

defineProps<{
  data: MapDataSource
}>()
</script>

<template>
  <MapBase
    :data="data"
    object-key="countries"
    fit="data"
    :data-transformer="(objects) => objects.map(/* some logic */)"
    :aspect-ratio="2 / 1"
    :projection="geoEquirectangular"
    :projection-config="{
      padding: 8,
      rotate: [[0, 12]], // array wrapper required
      scale: 200, // single argument can be passed as it is
      precision: [0.1], // also can be array-wrapped
    }"
  >
    <MapObjects />
  </MapBase>
</template>
```

== React

```tsx
import { geoEquirectangular } from 'd3-geo'
import { MapBase, MapObjects, type MapDataSource } from '@d3-maps/react'

export function Example({ data }: { data: MapDataSource }) {
  return (
    <MapBase
      data={data}
      objectKey="countries"
      fit="data"
      dataTransformer={(objects) => objects.map(/* some logic */)}
      aspectRatio={2 / 1}
      projection={geoEquirectangular}
      projectionConfig={{
        rotate: [[0, 12]], // array wrapper required
        scale: 200, // single argument can be passed as it is
        precision: [0.1], // also can be array-wrapped
      }}
    >
      <MapObjects />
    </MapBase>
  )
}
```

:::

## Helpers

- See [useCreateMapContext](/helpers/use-create-map-context)
- See [useMapContext](/helpers/use-map-context)

For adapter code and docs examples, prefer [useMapContext](/helpers/use-map-context) or `MapBase` slot/render-prop context over rebuilding a separate map context manually

## Advanced Composition

If controls or other consumers need the same map context outside the rendered `<svg>`, create the context once in the parent, pass it to sibling UI by prop, and pass the same object into `MapBase`.

:::tabs key:framework

== Vue

```vue
<script setup lang="ts">
import { computed } from 'vue'
import {
  type MapDataSource,
  useCreateMapContext,
} from '@d3-maps/vue'

const props = defineProps<{
  data: MapDataSource
}>()

const context = useCreateMapContext(computed(() => ({
  data: props.data,
  aspectRatio: 2 / 1,
})))
</script>

<template>
  <Toolbar :context="context" />
  <MapBase :context="context">
    <MapObjects />
  </MapBase>
</template>
```

== React

```tsx
import {
  MapBase,
  MapObjects,
  type MapDataSource,
  useCreateMapContext,
} from '@d3-maps/react'

export function Example({ data }: { data: MapDataSource }) {
  const context = useCreateMapContext({
    data,
    aspectRatio: 2 / 1,
  })

  if (!context) return null

  return (
    <>
      <Toolbar context={context} />
      <MapBase context={context}>
        <MapObjects />
      </MapBase>
    </>
  )
}
```

:::
