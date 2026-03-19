# MapLine

Renders a path between map locations

Use it for geographic `LineString` paths between locations

## Props

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `coordinates` | `[number, number][]` | — | Geographic line coordinates in `[longitude, latitude]` position format |
| `custom?` | `boolean` | `false` | Render the line from projected screen points instead of geographic `LineString` pathing |
| `curve?` | `CurveFactory \| CurveFactoryLineOnly` | — | Used only when `custom` is enabled. See [d3-shape curve](https://d3js.org/d3-shape/curve) |
| `styles?` | [MapObject['styles']](/api/core/mapObject#property-styles) | — | See [styling guide](/guide/core-concepts/#styling) |

You can also use native SVG attrs like `stroke`, `strokeWidth` right on the MapLine

## Usage

:::tabs key:framework

== Vue

```vue
<template>
  <Map :data="mapData">
    <MapFeatures />
    <MapLine
      :coordinates="[
        [-122.4194, 37.7749],
        [-98.5795, 39.8283],
        [-73.935242, 40.73061],
      ]"
      custom
      :curve="curveBasis"
    />
  </Map>
</template>

<script setup lang="ts">
import { curveBasis } from 'd3-shape'
</script>
```

== React

```tsx
import { curveBasis } from 'd3-shape'

<Map data={mapData}>
  <MapFeatures />
  <MapLine
    coordinates={[
      [-122.4194, 37.7749],
      [-98.5795, 39.8283],
      [-73.935242, 40.73061],
    ]}
    custom
    curve={curveBasis}
  />
</Map>
```

:::

::: tip Custom edges ←→
Use native [`marker-start`](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/marker-start) and [`marker-end`](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/marker-end) to make an arrow or any other custom form.

See how it's done in [connections example](/examples/connections)
:::

Use default `MapLine` rendering when you want geodesic `LineString` behavior.

Use `custom` when you want projected control over the path shape, and pass a D3 `curve` when you want interpolation beyond the default straight line.
