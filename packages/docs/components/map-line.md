# MapLine

Renders a path between map locations

## Props

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `coordinates` | `[number, number][]` | — | `[longitude, latitude][]` |
| `cartesian?` | `boolean` | `false` | Treat `coordinates` as local SVG points and skip map projection |
| `custom?` | `boolean` | `false` | Render using [d3-shape line](https://d3js.org/d3-shape/line) instead of default* |
| `curve?` | `number \| CurveFactory \| CurveFactoryLineOnly` | — | Used when `custom` or `cartesian` is enabled. A function uses D3 interpolation, a number uses the manual connector renderer |
| `styles?` | [MapObject['styles']](/api/core/mapObject#property-styles) | — | See [styling guide](/guide/core-concepts/#styling) |

\* By default renders [great arc](https://en.wikipedia.org/wiki/Great-circle_distance) using [d3-geo path](https://d3js.org/d3-geo/path#_path) with `'LineString'`

You can also use native SVG attrs like `stroke`, `strokeWidth` right on the MapLine

## Usage

:::tabs key:framework

== Vue

```vue
<template>
  <MapBase :data="mapData">
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
  </MapBase>
</template>

<script setup lang="ts">
import { curveBasis } from 'd3-shape'
</script>
```

== React

```tsx
import { curveBasis } from 'd3-shape'

<MapBase data={mapData}>
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
</MapBase>
```

:::

::: tip Custom edges ←→
Use native [`marker-start`](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/marker-start) and [`marker-end`](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/marker-end) to make an arrow or any other custom form.

See how it's done in [connections example](/examples/connections)
:::

Use default `MapLine` rendering when you want geodesic `LineString` behavior.

Use `cartesian` when you already have local SVG points and do not want map projection.

Use `custom` when you want projected control over the path shape.

Pass a D3 `curve` function for D3 interpolation, or pass a number like `0.5` to use the manual connector renderer.
