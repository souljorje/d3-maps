---
description: Component for D3 SVG map graticule lines in React and Vue
---

# MapGraticule

Renders graticule lines as an SVG `<path>` layer

## Props

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `config?` | [GraticuleConfig](/api/core/graticule#graticuleconfig) | — | See [usage](#config) below |

Use native SVG presentation attrs like `stroke` directly on `MapGraticule` lines.

Wrap graticule lines in `MapSphere` to keep them above the sphere background and below the sphere border.

### Config

Use `config` to call graticule generator methods before rendering

<!--@include: ./_modifiers-args-shape.md-->

See available methods in [d3-geo graticule docs](https://d3js.org/d3-geo/shape#geoGraticule)

## Usage

:::tabs key:framework

== Vue

```vue
<template>
  <MapBase>
    <MapSphere fill="#fff" stroke="#cbd5e1">
      <MapFeatures :data="mapData" fill="#f1f5f9" />
      <MapGraticule
        stroke="#94a3b8"
        :config="{
          step: [[15, 15]],
          precision: 2.5,
        }"
      />
    </MapSphere>
  </MapBase>
</template>
```

== React

```tsx
<MapBase>
  <MapSphere fill="#fff" stroke="#cbd5e1">
    <MapFeatures data={mapData} fill="#f1f5f9" />
    <MapGraticule
      stroke="#94a3b8"
      config={{
        step: [[15, 15]],
        precision: 2.5,
      }}
    />
  </MapSphere>
</MapBase>
```

:::

## Examples

- [Sphere And Graticule](/examples/sphere-and-graticule)
