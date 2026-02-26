# MapGraticule

Renders graticule lines and optional outline as SVG `<path>` layers

Outline is rendered only when `background` or `border` is provided
The outline is drawn as two paths: fill under lines and border over lines

## Props

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `config?` | [GraticuleConfig](/api/core/graticule#graticuleconfig) | — | See [config](#config) below |
| `background?` | `boolean \| string` | — | `true` renders background outline with no inline fill, `string` sets outline fill color |
| `border?` | `boolean \| string` | — | `true` renders border outline with no inline stroke, `string` sets outline stroke color |
| `stroke?` | `string` | — | Graticule lines stroke color |
| `styles?` | [MapObjectStyles](/api/core/mapObject#mapobjectstyles) | — | Applies map-object interaction styles to the lines path |

## Config

Use `config` to call graticule generator methods before rendering

```ts
{
  [methodName]: args[] | arg
}
```

- single non-array arg: can be passed as it is or wrapped with an array
- multiple args / single array arg: wrapped with an array
- See available methods in [d3-geo graticule docs](https://d3js.org/d3-geo/shape#geoGraticule)

## Events

<!--@include: ./_map-object-events.md-->

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
