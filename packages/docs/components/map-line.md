# MapLine

Renders a path between map locations

Use it for direct straight lines or geographic curves between locations

## Props

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `coordinates?` | `[number, number]` | `[]` | Line coordinates in `[longitude, latitude]` format |
| `curve?` | `boolean \| function` | `false` | `true` renders a [great-circle](https://en.wikipedia.org/wiki/Great-circle_distance) arc. For custom curve use [D3 curve factory](https://d3js.org/d3-shape/line#line_curve) |
| `styles?` | [MapObjectStyles](/api/core/mapObject#mapobjectstyles) | — | See [styling guide](/guide/core-concepts/#styling) |

You can also use native SVG attrs like `stroke`, `strokeWidth` right on the MapLine

## Usage

:::tabs key:framework

== Vue

```vue
<template>
  <Map :data="mapData">
    <MapFeatures />
    <MapLine
      :coordinates="[[-122.4194, 37.7749], [-73.935242, 40.73061]]"
      curve
    />
  </Map>
</template>
```

== React

```tsx
<Map data={mapData}>
  <MapFeatures />
  <MapLine
    coordinates={[[-122.4194, 37.7749], [-73.935242, 40.73061]]}
    curve
  />
</Map>
```

:::

::: tip Custom edges ←→
Use native [`marker-start`](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/marker-start) and [`marker-end`](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/marker-end) to make an arrow or any other custom form.

See how it's done in [connections example](/examples/connections)
:::
