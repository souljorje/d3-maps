---
description: Component for D3 SVG map TopoJSON borders and boundary lines in React and Vue
---

# MapMesh

Renders a TopoJSON mesh as an SVG `<path>`  
Use it to draw shared borders on top of features, it's more efficient than `stroke` on each feature.

_ℹ️ Works only with **TopoJSON** data_

## Props

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | [MapData](/api/core/data#MapData) | — | TopoJSON source |
| `objectKey?` | `string` | — | TopoJSON object key. If omited mesh is rendered from the whole topology. |
| `filter?` | `(a: GeometryObject, b: GeometryObject) => boolean` | — | See [topojson-client mesh](https://github.com/topojson/topojson-client#mesh) |

Use native SVG presentation attrs like `stroke` and `fill` directly on `MapMesh`

## Usage

:::tabs key:framework

== Vue

```vue
<template>
  <MapBase>
    <MapFeatures
      :data="mapData"
      object-key="countries"
      fill="#fff"
    />
    <MapMesh
      :data="mapData"
      object-key="countries"
      stroke="#000"
    />
  </MapBase>
</template>
```

== React

```tsx
<MapBase>
  <MapFeatures
    data={mapData}
    objectKey="countries"
    fill="#fff"
  />
  <MapMesh
    data={mapData}
    objectKey="countries"
    stroke="#000"
  />
</MapBase>
```

:::
