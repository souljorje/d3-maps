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
| `transition?` | [ZoomTransition](/api/core/zoom#zoomtransition) | — | Animate programmatic zoom with [d3-transition](https://d3js.org/d3-transition) |
| `config?` | [ZoomModifiers](/api/core/zoom#zoommodifiers) | — | See the [guide](#config) below |

## Controls

Use the `MapZoom` component ref for programmatic zoom commands.

| Method | Description |
| --- | --- |
| `zoomTo(transform, options?)` | Apply a native D3 `ZoomTransform` |
| `zoomToScale(scale, options?)` | Apply an absolute scale using D3 `scaleTo` |
| `zoomBy(delta, options?)` | Add or subtract from the current zoom scale |
| `zoomToFeature(feature, options?)` | Zoom to a GeoJSON feature |
| `reset(options?)` | Reset to `zoomIdentity` |

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
import type { MapZoomCommands } from '@d3-maps/vue'
import { type ComponentPublicInstance, useTemplateRef } from 'vue'

const zoom = useTemplateRef<ComponentPublicInstance & MapZoomCommands>('zoom')

function zoomIn() {
  zoom.value?.zoomBy(0.5)
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
import { MapZoom, type MapZoomHandle } from '@d3-maps/react'
import { useRef } from 'react'

export function Example() {
  const zoomRef = useRef<MapZoomHandle | null>(null)

  function zoomIn() {
    zoomRef.current?.zoomBy(0.5)
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
