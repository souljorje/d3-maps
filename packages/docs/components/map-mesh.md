# MapMesh

Renders a TopoJSON mesh as an SVG `<path>`.  
Use it to draw shared borders/edges (for example country boundaries) on top of feature fills.

_ℹ️ Works only with **TopoJSON** data_

## Props

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `styles?` | [MapObjectStyles](/api/core/mapObject#mapobjectstyles) | — | See [styling guide](/guide/core-concepts/#styling) |

Use native SVG presentation attrs like `stroke`/`fill` directly on `MapMesh`.

## Usage

:::tabs key:framework

== Vue

```vue
<template>
  <Map :data="topologyData">
    <MapFeatures fill="#fff" />
    <MapMesh stroke="#000"/>
  </Map>
</template>
```

== React

```tsx
<Map data={topologyData}>
  <MapFeatures fill="#fff" />
  <MapMesh stroke="#000" />
</Map>
```

:::
