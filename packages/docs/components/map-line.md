---
description: Component for D3 SVG map lines, arcs, and curved paths in React and Vue
---

# MapLine

Renders a path between map locations

## Props

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `coordinates` | `[number, number][]` | — | `[longitude, latitude][]` |
| `cartesian?` | `boolean` | `false` | Treat `coordinates` as local SVG points and skip map projection |
| `custom?` | `boolean` | `false` | Render using [d3-shape line](https://d3js.org/d3-shape/line) instead of default |
| `curve?` | `CurveFactory \| CurveFactoryLineOnly` | `curveNatural` | Any [d3-shape curve](https://d3js.org/d3-shape/curve). Works only with `custom` or `cartesian` |
| `midpoint?` | `[lengthwise: number, crosswise: number]` | — | Adds a point between each coordinate pair. Value sets position relative to the line center in % from its length. |
| `styles?` | [MapObject['styles']](/api/core/mapObject#property-styles) | — | See [styling guide](/guide/core-concepts/#styling) |

You can also use native SVG attrs like `stroke`, `strokeWidth` right on the MapLine

::: details `midpoint` usage

Line bend depending on `midpoint[1]` value

| Line direction | Positive | Negative |
| --- | --- | --- |
| → | Up | Down |
| ← | Down | Up |
| ↓ | Left | Right |
| ↑ | Right | Left |

:::

## Usage

::: details Custom curves and edges

**Curves**

By default renders a [great arc](https://en.wikipedia.org/wiki/Great-circle_distance) using [d3-geo path](https://d3js.org/d3-geo/path#_path) with `'LineString'` (looks ok usually).  
To control line bending use `custom` + `midpoint` + `curve`. See interactive [curve examples](https://www.d3indepth.com/examples-merged/shapes/curve-explorer/)

**Edges ←→**

Use native attributes [marker-start](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/marker-start) and [marker-end](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/marker-end) to make an arrow or any other custom form.

👀 See both in [connections example](/examples/connections)
:::

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
