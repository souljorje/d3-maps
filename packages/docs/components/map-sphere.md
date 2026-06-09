---
description: Component for D3 SVG map sphere path styling in React and Vue
---

# MapSphere

Renders the map sphere as an SVG `<g>` wrapper with background and border paths

Place map content inside `MapSphere` to render it between the background path and border path. Child content is clipped to the sphere by default.

## Props

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `fill?` | `string` | `none` | SVG fill for the background sphere path |
| `stroke?` | `string` | `none` | SVG stroke for the border sphere path |
| `noClip?` | `boolean` | `false` | Disable clipping child content to the sphere path |

## Usage

:::tabs key:framework

== Vue

```vue
<template>
  <MapBase>
    <MapZoom>
      <MapSphere fill="#f8fafc" stroke="#cbd5e1">
        <MapFeatures :data="mapData" fill="#f1f5f9" />
        <MapGraticule
          stroke="#94a3b8"
          :config="{
            step: [[15, 15]],
            precision: 2.5,
          }"
        />
      </MapSphere>
    </MapZoom>
  </MapBase>
</template>
```

== React

```tsx
<MapBase>
  <MapZoom>
    <MapSphere fill="#f8fafc" stroke="#cbd5e1">
      <MapFeatures data={mapData} fill="#f1f5f9" />
      <MapGraticule
        stroke="#94a3b8"
        config={{
          step: [[15, 15]],
          precision: 2.5,
        }}
      />
    </MapSphere>
  </MapZoom>
</MapBase>
```

:::

## Examples

- [Sphere And Graticule](/examples/sphere-and-graticule)
