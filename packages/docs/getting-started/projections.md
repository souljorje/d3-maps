# Projections

A map projection transforms the Earth's 3D curved surface onto a 2D flat map, or an SVG map in our case. It determines how exactly our map will look.  
[d3-geo](https://github.com/d3/d3-geo) and [d3-geo-projection](https://github.com/d3/d3-geo-projection) help with it under the hood.  

## Providing a projection

By default `geoEqualEarth` is used in core, but you can provide your own:

::: code-group

```vue [vue]
<script setup>
import { geoMercator } from 'd3-geo-projection'
</script>

<template>
  <Map :projection="geoMercator">
    <MapFeatures></MapFeatures>
  </Map>
</template>
```

```tsx [react]
import { geoMercator } from 'd3-geo-projection'
import { Map, MapFeatures } from '@d3-maps/react'

export function Example({ data }: { data: unknown }) {
  return (
    <Map
      data={data}
      projection={geoMercator}
    >
      <MapFeatures />
    </Map>
  )
}
```

:::

## Configuring a projection

Use [Map](/components/map#props) `projectionConfig` for common tweaks:

::: code-group

```vue [vue]
<Map
  :projection="geoMercator"
  :projection-config="{
    center: [20, 10],
    rotate: [-11, 0],
    scale: 3,
  }"
>
  <MapFeatures />
</Map>
```

```tsx [react]
<Map
  projection={geoMercator}
  projectionConfig={{
    center: [20, 10],
    rotate: [-11, 0],
    scale: 3,
  }}
>
  <MapFeatures />
</Map>
```

:::

Here you can see all [available projections](https://observablehq.com/@fil/d3-projections)
