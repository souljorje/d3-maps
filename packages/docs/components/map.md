# Map

Renders the root `<svg>` and provides a reactive map context to children.

## Props

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | [MapData](/api/core/map#mapdata) | — | TopoJSON or GeoJSON |
| `width?` | `number` | `600` | Internal width used by projection fitting and path rendering. |
| `height?` | `number` | `width / aspectRatio` | Internal height used by projection fitting and path rendering. |
| `aspectRatio?` | `number` | `2 / 1` | Used to derive `height` when `height` is not provided. |
| `projection?` | `() => GeoProjection` | `geoNaturalEarth1` | d3-geo projection factory |
| `projectionConfig?` | [ProjectionConfig](/api/core/map#projectionconfig) | — | See the [guide](#projectionconfig) below |
| `dataTransformer?` | [DataTransformer](/api/core/map#datatransformer) | — | Optional transform applied to GeoJSON features before rendering |

### projectionConfig

Use `projectionConfig` to call projection methods before rendering

```ts
{
  [methodName]: methodArgs[] | methodArg
}
```
- single non-array arg: can be passed as it is or wrapped with an array
- multiple args / single array arg: wrapped with an array

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
import type { MapData } from '@d3-maps/core'

import { geoMercator } from 'd3-geo'
</script>

<template>
  <Map
    :data="data"
    :data-transformer="(features) => features.map(/* some logic */)"
    :aspect-ratio="2 / 1"
    :projection="geoMercator"
    :projection-config="{
      rotate: [[0, 12]], // array wrapper required
      scale: 200, // single argument can be passed as it is
      precision: [0.1], // also can be array-wrapped
    }"
  >
    <MapFeatures />
  </Map>
</template>
```

== React

```tsx
import type { MapData } from '@d3-maps/core'

import { geoMercator } from 'd3-geo'
import { Map, MapFeatures } from '@d3-maps/react'

export function Example({ data }: { data: MapData }) {
  return (
    <Map
      data={data}
      dataTransformer={(features) => features.map(/* some logic */)}
      aspectRatio={2 / 1}
      projection={geoMercator}
      projectionConfig={{
        rotate: [[0, 12]], // array wrapper required
        scale: 200, // single argument can be passed as it is
        precision: [0.1], // also can be array-wrapped
      }}
    >
      <MapFeatures />
    </Map>
  )
}
```

:::

## Hooks

- See [useMapContext](/hooks/use-map-context)
