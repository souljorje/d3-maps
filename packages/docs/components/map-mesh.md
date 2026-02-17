# MapMesh

Renders a TopoJSON mesh from the current map context as an SVG `<path>`.

Use this to draw shared borders/edges (for example country boundaries) on top of feature fills.

## Requirements

`MapMesh` depends on `MapContext.renderMesh()` from `@d3-maps/core`, so mesh rendering is available when map data is provided as **TopoJSON**.

## Props

| Parameter | Type | Default value | Description |
| --- | --- | --- | --- |
| `styles` | [MapObjectStyles](/api/core/mapObject#mapobjectstyles) | — | Style object with `default`, `hover`, and `active` states. |
| `fill` | `string` | — | SVG presentation prop. |
| `stroke` | `string` | — | SVG presentation prop. |

## Events

`mouseenter` `mouseleave` `mousedown` `mouseup` `focus` `blur`

## Usage

```vue
<template>
  <Map :data="topologyData">
    <MapFeatures fill="#e5e7eb" />
    <MapMesh
      fill="none"
      stroke="#111827"
      :styles="{
        default: { strokeWidth: 0.5 },
        hover: { strokeWidth: 0.8 },
        active: { strokeWidth: 1.2 },
      }"
    />
  </Map>
</template>
```
