---
description: Component for D3 SVG map pan and zoom in React and Vue
---

# MapZoom

Enables zoom and drag behavior using `d3-zoom`.

Wrap layers that should be zoomed inside [MapZoom](/components/map-zoom).

Use [useMapZoom](/helpers/use-map-zoom) inside `MapZoom` when controls or overlays need zoom state

Keep `center` and `zoom` controlled in the parent and update them from the zoom callbacks

## Props

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `center?` | `[number, number]` | viewport center | Point to be centered in the viewport |
| `zoom?` | `number` | `1` | Controlled zoom level |
| `minZoom?` | `number` | `1` | Minimum zoom scale |
| `maxZoom?` | `number` | `8` | Maximum zoom scale |
| `transition?` | [ZoomTransition](/api/core/zoom#zoomtransition) | — | Animate zoom with [d3-transition](https://d3js.org/d3-transition) and [d3-ease](https://d3js.org/d3-ease) |
| `config?` | [ZoomModifiers](/api/core/zoom#zoommodifiers) | — | See the [guide](#config) below |

### Config

Use `config` to call zoom methods before rendering

<!--@include: ./_modifiers-args-shape.md-->

See available methods in [d3-zoom docs](https://d3js.org/d3-zoom) and usage example below

## Events

:::tabs key:framework

== Vue

Emits:

- `zoomStart`
- `zoom`
- `zoomEnd`
- `update:center`
- `update:zoom`

== React

Callbacks:

- `onZoomStart`
- `onZoom`
- `onZoomEnd`

:::

## Usage

:::tabs key:framework

== Vue

```vue
<template>
  <MapZoom
    v-model:center="center"
    v-model:zoom="zoom"
    :min-zoom="1"
    :max-zoom="6"
    :config="{
      translateExtent: [[[0, 0], [1200, 800]]], // array wrapper required
      duration: 250, // single argument can be passed as it is
      clickDistance: [8], // also can be array-wrapped
    }"
  >
    <MapFeatures />
  </MapZoom>
</template>
```

== React

```tsx
<MapZoom
  minZoom={1}
  maxZoom={6}
  config={{
    translateExtent: [[[0, 0], [1200, 800]]], // array wrapper required
    duration: 250, // single argument can be passed as it is
    clickDistance: [8], // also can be array-wrapped
  }}
>
  <MapFeatures />
</MapZoom>
```

:::

## Helpers

- [useMapZoom](/helpers/use-map-zoom)
- [getZoomView](/helpers/get-object-zoom-view)

## Examples

- [Zoom](/examples/zoom)
- [Programmatic Zoom](/examples/programmatic-zoom)
