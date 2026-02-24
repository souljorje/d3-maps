# Map

Renders the root `<svg>` and provides a reactive map context to children.

## Props

| Parameter | Type | Default value | Description |
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

## Usage

:::tabs key:framework

== Vue

```vue
<script setup lang="ts">
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
      scale: 200 // single argument can be passed as it is
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
        scale: 200 // single argument can be passed as it is
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
