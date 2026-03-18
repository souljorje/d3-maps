# MapZoom

Enables zoom and drag behavior using `d3-zoom`.

Wrap layers that should be zoomed inside [MapZoom](/components/map-zoom).

## Props

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `center?` | `[number, number]` | current viewport center | Raw translate offset. If omitted, changing `zoom` alone preserves the current viewport center |
| `zoom?` | `number` | `1` | Initial zoom level |
| `minZoom?` | `number` | `1` | Minimum zoom scale |
| `maxZoom?` | `number` | `8` | Maximum zoom scale |
| `config?` | [ZoomModifiers](/api/core/zoom#zoommodifiers) | — | See the [guide](#config) below |

Changing `zoom` alone preserves the current viewport center by default.
Pass `center` when you need exact `translate(...center).scale(zoom)` control.

### Config

Use `config` to call zoom methods before rendering

<!--@include: ./_modifiers-args-shape.md-->

- See available methods in [d3-zoom docs](https://d3js.org/d3-zoom)
- See usage example below

## Events

:::tabs key:framework

== Vue

Emits:

- `zoomstart`
- `zoom`
- `zoomend`

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
