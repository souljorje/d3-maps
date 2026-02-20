# Map

Renders the root `<svg>` and provides a reactive map context to children.

## Props

| Parameter | Type | Default value | Description |
| --- | --- | --- | --- |
| `data` | [MapData](/api/core/map#mapdata) | — | TopoJSON or GeoJSON |
| `width` | `number` | `600` | Internal width used by projection fitting and path rendering. |
| `height` | `number` | `width / aspectRatio` | Internal height used by projection fitting and path rendering. |
| `aspectRatio` | `number` | `16 / 9` | Used to derive `height` when `height` is not provided. |
| `projection` | `() => GeoProjection` | `geoEqualEarth` | d3-geo projection factory |
| `projectionConfig` | [ProjectionConfig](/api/core/map#projectionconfig) | — | `center`, `rotate`, `scale` |
| `dataTransformer` | [DataTransformer](/api/core/map#datatransformer) | — | Optional transform applied to GeoJSON features before rendering |

## Usage

::: code-group

```vue
<script setup lang="ts">
import { geoMercator } from 'd3-geo'
</script>

<template>
  <Map
    :data="data"
    :aspect-ratio="4 / 3"
    :projection="geoMercator"
    :projection-config="{ center: [0, 20], rotate: [0, 0, 0], scale: 160 }"
    :data-transformer="(features) => features"
  >
    <MapFeatures />
  </Map>
</template>
```

```tsx [react]
import type { MapData } from '@d3-maps/core'

import { geoMercator } from 'd3-geo'
import { Map, MapFeatures } from '@d3-maps/react'

export function Example({ data }: { data: MapData }) {
  return (
    <Map
      data={data}
      aspectRatio={4 / 3}
      projection={geoMercator}
      projectionConfig={{ center: [0, 20], rotate: [0, 0, 0], scale: 160 }}
      dataTransformer={(features) => features}
    >
      <MapFeatures />
    </Map>
  )
}
```

:::
