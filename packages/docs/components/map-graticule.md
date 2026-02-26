# MapGraticule

Renders graticule lines and optional outline as SVG `<path>` layers

Outline is rendered only when `background` or `border` is provided
The outline is drawn as two paths: fill under lines and border over lines

## Props

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `background?` | `boolean \| string` | — | `true` renders background outline with no inline fill, `string` sets outline fill color |
| `border?` | `boolean \| string` | — | `true` renders border outline with no inline stroke, `string` sets outline stroke color |
| `config?` | [GraticuleConfig](/api/core/graticule#graticuleconfig) | — | See [usage](#config) below |
| `styles?` | [MapObjectStyles](/api/core/mapObject#mapobjectstyles) | — | Applies map-object interaction styles to the lines path |

Use native SVG presentation attrs like `stroke` directly on `MapGraticule` lines.

### Config

Use `config` to call graticule generator methods before rendering

<!--@include: ./_modifiers-args-shape.md-->

See available methods in [d3-geo graticule docs](https://d3js.org/d3-geo/shape#geoGraticule)

## Usage

:::tabs key:framework

== Vue

```vue
<template>
  <Map :data="mapData">
    <MapFeatures fill="#f1f5f9" />
    <MapGraticule
      stroke="#94a3b8"
      background="#ffffff"
      border="#cbd5e1"
      :config="{
        step: [[15, 15]],
        precision: 2.5,
      }"
    />
  </Map>
</template>
```

== React

```tsx
<Map data={mapData}>
  <MapFeatures fill="#f1f5f9" />
  <MapGraticule
    stroke="#94a3b8"
    background="#ffffff"
    border="#cbd5e1"
    config={{
      step: [[15, 15]],
      precision: 2.5,
    }}
  />
</Map>
```

:::
