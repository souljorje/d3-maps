# MapLine

Renders a path between map locations

Use it for geographic `LineString` paths between locations

## Props

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `coordinates` | `[number, number][]` | — | Geographic line coordinates in `[longitude, latitude]` position format |
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
      :coordinates="[[-122.4194, 37.7749], [-98.5795, 39.8283], [-73.935242, 40.73061]]"
    />
  </Map>
</template>
```

== React

```tsx
<Map data={mapData}>
  <MapFeatures />
  <MapLine
    coordinates={[[-122.4194, 37.7749], [-98.5795, 39.8283], [-73.935242, 40.73061]]}
  />
</Map>
```

:::

::: tip Custom edges ←→
Use native [`marker-start`](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/marker-start) and [`marker-end`](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/marker-end) to make an arrow or any other custom form.

See how it's done in [connections example](/examples/connections)
:::
