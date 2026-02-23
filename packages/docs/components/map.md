# Map

Renders the root `<svg>` and provides a reactive map context to children.

## Props

| Parameter | Type | Default value | Description |
| --- | --- | --- | --- |
| `data` | [MapData](/api/core/map#mapdata) | — | TopoJSON or GeoJSON |
| `width?` | `number` | `600` | Internal width used by projection fitting and path rendering. |
| `height?` | `number` | `width / aspectRatio` | Internal height used by projection fitting and path rendering. |
| `aspectRatio?` | `number` | `16 / 9` | Used to derive `height` when `height` is not provided. |
| `projection?` | `() => GeoProjection` | `geoEqualEarth` | d3-geo projection factory |
| `projectionConfig?` | [ProjectionConfig](/api/core/map#projectionconfig) | — | See the [guide](#projectionconfig) below |
| `dataTransformer?` | [DataTransformer](/api/core/map#datatransformer) | — | Optional transform applied to GeoJSON features before rendering |

### projectionConfig

Use `projectionConfig` to call projection methods before rendering

```ts
{
  [methodName]: methodArgs[] | methodArg
}
```

- single non-array arg: `arg` | `[arg]`
- multiple args/single array arg: wrapped with an array

- See available methods in [d3-geo projection docs](https://d3js.org/d3-geo/projection)
- See usage example below

## Usage

::: code-group

```vue
<script setup lang="ts">
import { geoMercator } from 'd3-geo'
</script>

<template>
  <Map
    :data="data"
    :data-transformer="(features) => features.map(/* some logic */)"
    :aspect-ratio="16 / 9"
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

:::
