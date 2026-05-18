---
description: Component for D3 SVG map sphere path styling in React and Vue
---

# MapSphere

Renders the map sphere as a single SVG `<path>`

Use `MapSphere` outside `MapZoom` to keep the outline visually stable while zooming map content

The default `fill` is `none` and the default `stroke` is `currentColor`

## Props

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `fill?` | `string` | `none` | SVG fill for the sphere path |
| `stroke?` | `string` | `currentColor` | SVG stroke for the sphere path |

## Usage

:::tabs key:framework

== Vue

```vue
<template>
  <MapBase :data="mapData">
    <MapSphere fill="#f8fafc" />
    <MapZoom>
      <MapFeatures fill="#f1f5f9" />
      <MapGraticule
        stroke="#94a3b8"
        :config="{
          step: [[15, 15]],
          precision: 2.5,
        }"
      />
    </MapZoom>
  </MapBase>
</template>
```

== React

```tsx
<MapBase data={mapData}>
  <MapSphere fill="#f8fafc" />
  <MapZoom>
    <MapFeatures fill="#f1f5f9" />
    <MapGraticule
      stroke="#94a3b8"
      config={{
        step: [[15, 15]],
        precision: 2.5,
      }}
    />
  </MapZoom>
</MapBase>
```

:::
