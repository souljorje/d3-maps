---
description: Component for the root D3 SVG map container and shared map context in React and Vue
---

# MapBase

Renders the root `<svg>` and provides a reactive map context to children

## Props

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `projection?` | `() => GeoProjection` | `geoNaturalEarth1` | d3-geo projection factory |
| `projectionConfig?` | [ProjectionConfig](/api/core/map#projectionconfig) | — | See the [guide](#projectionconfig) below |
| `width?` | `number` | `600` |  |
| `height?` | `number` | `width/aspectRatio` |  |
| `aspectRatio?` | `number` | `2 / 1` | Used to derive `height` when `height` is not provided |
| `fit?` | [MapFit](/api/core/map#mapfit) | `sphere` | Built-in fit source |
| `fitObjectKey?` | `string` | — | TopoJSON object key used when `fit` is an explicit topology |
| `context?` | [MapContext](/api/core/map#mapcontext) | — | Optional externally created context. When provided, `MapBase` uses it instead of creating one from props |

### projectionConfig

Use `projectionConfig` to call projection methods before rendering

<!--@include: ./_modifiers-args-shape.md-->

See available methods in [d3-geo projection docs](https://d3js.org/d3-geo/projection)

### fit

- `fit: 'sphere'` keeps the world-map default
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
import { type MapData } from '@d3-maps/vue'

defineProps<{
  data: MapData
}>()
</script>

<template>
  <MapBase
    :fit="data"
    fit-object-key="countries"
    :aspect-ratio="2 / 1"
    :projection="geoEquirectangular"
    :projection-config="{
      padding: 8,
      rotate: [[0, 12]], // array wrapper required
      scale: 200, // single argument can be passed as it is
      precision: [0.1], // also can be array-wrapped
    }"
  >
    <MapFeatures
      :data="data"
      object-key="countries"
    />
  </MapBase>
</template>
```

== React

```tsx
import { geoEquirectangular } from 'd3-geo'
import { MapBase, MapFeatures, type MapData } from '@d3-maps/react'

export function Example({ data }: { data: MapData }) {
  return (
    <MapBase
      fit={data}
      fitObjectKey="countries"
      aspectRatio={2 / 1}
      projection={geoEquirectangular}
      projectionConfig={{
        rotate: [[0, 12]], // array wrapper required
        scale: 200, // single argument can be passed as it is
        precision: [0.1], // also can be array-wrapped
      }}
    >
      <MapFeatures
        data={data}
        objectKey="countries"
      />
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

If controls or other consumers need the same map context outside the rendered `<svg>`, create the context once in the parent, pass it to sibling UI by prop, and pass the same object into `MapBase`

:::tabs key:framework

== Vue

```vue
<script setup lang="ts">
import { computed } from 'vue'
import {
  type MapData,
  useCreateMapContext,
} from '@d3-maps/vue'

const props = defineProps<{
  data: MapData
}>()

const context = useCreateMapContext(computed(() => ({
  aspectRatio: 2 / 1,
})))
</script>

<template>
  <Toolbar :context="context" />
  <MapBase :context="context">
    <MapFeatures :data="props.data" />
  </MapBase>
</template>
```

== React

```tsx
import {
  MapBase,
  MapFeatures,
  type MapData,
  useCreateMapContext,
} from '@d3-maps/react'

export function Example({ data }: { data: MapData }) {
  const context = useCreateMapContext({
    aspectRatio: 2 / 1,
  })

  if (!context) return null

  return (
    <>
      <Toolbar context={context} />
      <MapBase context={context}>
        <MapFeatures data={data} />
      </MapBase>
    </>
  )
}
```

:::
