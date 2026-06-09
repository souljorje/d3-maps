---
description: Component for D3 SVG map pan and zoom in React and Vue
---

# MapZoom

Enables pan and zoom behavior using `d3-zoom`.

Wrap layers that should move together inside [MapZoom](/components/map-zoom).

## Props

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `minZoom?` | `number` | `1` | Minimum zoom scale |
| `maxZoom?` | `number` | `8` | Maximum zoom scale |
| `transition?` | [ZoomTransition](/api/core/zoom#zoomtransition) | — | Transition step or ordered transition steps for programmatic zoom |
| `config?` | [ZoomModifiers](/api/core/zoom#zoommodifiers) | — | See the [guide](#config) below |

## Controls

Use `useMapZoom` with the `MapZoom` component ref for programmatic zoom commands.

| Method | Description |
| --- | --- |
| `transform(transform, point?, transition?)` | Apply a native D3 `ZoomTransform` |
| `translateBy(x, y, transition?)` | Translate by x and y using D3 `translateBy` |
| `translateTo(x, y, point?, transition?)` | Translate to x and y using D3 `translateTo` |
| `scaleBy(scale, point?, transition?)` | Multiply scale using D3 `scaleBy` |
| `scaleTo(scale, point?, transition?)` | Apply an absolute scale using D3 `scaleTo` |
| `scaleWith(delta, point?, transition?)` | Add or subtract from the current zoom scale |
| `zoomToFeature(feature, options?)` | Zoom to a GeoJSON feature |
| `reset(transition?)` | Reset to `zoomIdentity` |

Command transitions accept `false | ZoomTransition`. `zoomToFeature` keeps an options object for `padding` and `transition`.

## Config

Use `config` to call native `d3-zoom` methods before rendering.

<!--@include: ./_modifiers-args-shape.md-->

See available methods in [d3-zoom docs](https://d3js.org/d3-zoom).

## Events

Lifecycle events forward the native D3 zoom event.

:::tabs key:framework

== Vue

Emits:

- `zoomStart(event: ZoomEvent)`
- `zoom(event: ZoomEvent)`
- `zoomEnd(event: ZoomEvent)`

== React

Callbacks:

- `onZoomStart(event: ZoomEvent)`
- `onZoom(event: ZoomEvent)`
- `onZoomEnd(event: ZoomEvent)`

:::

## Usage

:::tabs key:framework

== Vue

```vue
<script setup lang="ts">
import type { MapZoomRef } from '@d3-maps/vue'
import { useMapZoom } from '@d3-maps/vue'
import { useTemplateRef } from 'vue'

const zoomRef = useTemplateRef<MapZoomRef>('zoom')
const zoom = useMapZoom(zoomRef)

function zoomIn() {
  zoom.scaleWith(0.5)
}
</script>

<template>
  <MapZoom
    ref="zoom"
    :min-zoom="1"
    :max-zoom="6"
  >
    <MapFeatures />
  </MapZoom>
</template>
```

== React

```tsx
import { MapZoom, type MapZoomRef, useMapZoom } from '@d3-maps/react'
import { useRef } from 'react'

export function Example() {
  const zoomRef = useRef<MapZoomRef | null>(null)
  const zoom = useMapZoom(zoomRef)

  function zoomIn() {
    zoom.scaleWith(0.5)
  }

  return (
    <MapZoom
      ref={zoomRef}
      minZoom={1}
      maxZoom={6}
    >
      <MapFeatures />
    </MapZoom>
  )
}
```

:::

## Examples

- [Zoom](/examples/zoom)
- [Programmatic Zoom](/examples/programmatic-zoom)
