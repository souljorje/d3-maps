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

### config

Use `config` to call native `d3-zoom` methods before rendering.

<!--@include: ./_modifiers-args-shape.md-->

See available methods in [d3-zoom docs](https://d3js.org/d3-zoom).

## Ref

Available via component ref

- `container` — `<g>` wrapper
- `zoomBehavior` — [d3-zoom](https://d3js.org/d3-zoom#zoom)
- programmatic zoom methods, see [useMapZoom](/helpers/use-map-zoom) for API and usage

## Events

Lifecycle events forward the native D3 zoom event.

:::tabs key:framework

== Vue

- `zoomStart(event: ZoomEvent)`
- `zoom(event: ZoomEvent)`
- `zoomEnd(event: ZoomEvent)`

== React

- `onZoomStart(event: ZoomEvent)`
- `onZoom(event: ZoomEvent)`
- `onZoomEnd(event: ZoomEvent)`

:::

## Usage

:::tabs key:framework

== Vue

```vue
<script setup lang="ts">
import { useMapZoom } from '@d3-maps/vue'

const zoom = useMapZoom('zoomRef')
const transition = { duration: 600 }

function zoomIn() {
  zoom.scaleWith(0.5)
}
</script>

<template>
  <MapZoom
    ref="zoomRef"
    :min-zoom="1"
    :max-zoom="6"
    :transition="transition"
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
  const transition = { duration: 600 }

  function zoomIn() {
    zoom.scaleWith(0.5)
  }

  return (
    <MapZoom
      ref={zoomRef}
      minZoom={1}
      maxZoom={6}
      transition={transition}
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
