---
description: Component for D3 SVG map TopoJSON borders and boundary lines in React and Vue
---

# MapMesh

Renders a TopoJSON mesh as an SVG `<path>`.  
Use it to draw shared borders/edges (for example country boundaries) on top of feature fills.

_ℹ️ Works only with **TopoJSON** data_

## Props

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `data?` | [MapDataSource](/api/core/data#MapDataSource) | — | Optional layer-local TopoJSON source. Falls back to `MapBase` context data |
| `objectKey?` | `string` | — | Optional TopoJSON object key. Falls back to `MapBase` context object key |
| `styles?` | [MapObject['styles']](/api/core/mapObject#property-styles) | — | See [styling guide](/guide/core-concepts/#styling) |

Use native SVG presentation attrs like `stroke`/`fill` directly on `MapMesh`.

## Usage

:::tabs key:framework

== Vue

```vue
<template>
  <MapBase
    :data="mapData"
    object-key="countries"
  >
    <MapObjects fill="#fff" />
    <MapMesh stroke="#000"/>
  </MapBase>
</template>
```

== React

```tsx
<MapBase
  data={mapData}
  objectKey="countries"
>
  <MapObjects fill="#fff" />
  <MapMesh stroke="#000" />
</MapBase>
```

:::
