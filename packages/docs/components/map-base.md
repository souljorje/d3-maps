# MapBase

Renders the root `<svg>` and provides a reactive map context to children.

## Props

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | [MapData](/api/core/map#mapdata) | — | TopoJSON or GeoJSON |
| `width?` | `number` | `600` |  |
| `height?` | `number` | `width/aspectRatio` |  |
| `aspectRatio?` | `number` | `2 / 1` | Used to derive `height` when `height` is not provided. |
| `projection?` | `() => GeoProjection` | `geoNaturalEarth1` | d3-geo projection factory |
| `projectionConfig?` | [ProjectionConfig](/api/core/map#projectionconfig) | — | See the [guide](#projectionconfig) below |
| `dataTransformer?` | [DataTransformer](/api/core/map#datatransformer) | — | Optional transform applied to GeoJSON features before rendering |
| `context?` | [MapContext](/api/core/map#mapcontext) | — | Optional externally created context. When provided, `MapBase` uses it instead of creating one from props, and `data` is not required |

### projectionConfig

Use `projectionConfig` to call projection methods before rendering

<!--@include: ./_modifiers-args-shape.md-->

See available methods in [d3-geo projection docs](https://d3js.org/d3-geo/projection)  
and usage example below

::: details Core defaults
```ts
if (!(fitExtent || fitSize || fitWidth || fitHeight)) {
  mapProjection.fitExtent([[1, 1], [width - 1, height - 1]], { type: 'Sphere' })
}
if (!precision) {
  mapProjection.precision(0.2)
}
```
Source: [packes/core/src/lib/map.ts](https://github.com/souljorje/d3-maps/blob/main/packages/core/src/lib/map.ts#:~:text=makeProjection)
:::

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
    :data="data"
    :data-transformer="(features) => features.map(/* some logic */)"
    :aspect-ratio="2 / 1"
    :projection="geoEquirectangular"
    :projection-config="{
      rotate: [[0, 12]], // array wrapper required
      scale: 200, // single argument can be passed as it is
      precision: [0.1], // also can be array-wrapped
    }"
  >
    <MapFeatures />
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
      data={data}
      dataTransformer={(features) => features.map(/* some logic */)}
      aspectRatio={2 / 1}
      projection={geoEquirectangular}
      projectionConfig={{
        rotate: [[0, 12]], // array wrapper required
        scale: 200, // single argument can be passed as it is
        precision: [0.1], // also can be array-wrapped
      }}
    >
      <MapFeatures />
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
  type MapData,
  useCreateMapContext,
} from '@d3-maps/vue'

const props = defineProps<{
  data: MapData
}>()

const context = useCreateMapContext(computed(() => ({
  data: props.data,
  aspectRatio: 2 / 1,
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
import {
  MapBase,
  MapFeatures,
  type MapData,
  useCreateMapContext,
} from '@d3-maps/react'

export function Example({ data }: { data: MapData }) {
  const context = useCreateMapContext({
    data,
    aspectRatio: 2 / 1,
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
