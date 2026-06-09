---
description: Helper for programmatic zoom commands with a MapZoom component ref in React and Vue
---

# useMapZoom

Creates a stable set of programmatic zoom commands from a [MapZoom](/components/map-zoom) ref

## Return value

| Method | Description |
| --- | --- |
| `transform(transform, point?, transition?)` | Apply a native D3 `ZoomTransform` |
| `translateBy(x, y, transition?)` | Translate by x and y using D3 `translateBy` |
| `translateTo(x, y, point?, transition?)` | Translate to x and y using D3 `translateTo` |
| `scaleBy(scale, point?, transition?)` | Multiply scale using D3 `scaleBy` |
| `scaleTo(scale, point?, transition?)` | Apply an absolute scale using D3 `scaleTo` |
| `scaleWith(delta, point?, transition?)` | Add or subtract from the current zoom scale |
| `zoomToFeature(feature, {transition, padding})` | Zoom to a GeoJSON feature |
| `reset(transition?)` | Reset to `zoomIdentity` |

> Methods are available directly without `ref.current?.` / `ref.value?.`

`scaleWith`, `zoomToFeature` and `reset` are custom helpers, rest are handy wrappers around native [d3-zoom methods](https://d3js.org/d3-zoom) with automatic selection and transition handling.

See [ZoomCommands API](/api/core/zoom#zoomcommands)

### transition

Can be an object for one step or an array for chained transition steps.  
See [ZoomTransitionStep API](/api/core/zoom#zoomtransitionstep) and [d3-transition docs](https://d3js.org/d3-transition/timing#timing).

## Parameters

:::tabs key:framework

== Vue

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `ref` | `Ref<MapZoomRef \| null>` | — | `MapZoom` instance ref |

== React

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `ref` | `RefObject<MapZoomRef \| null>` | — | `MapZoom` instance ref |

:::

## Usage

:::tabs key:framework

== Vue

```vue
<script setup lang="ts">
import type { MapZoomRef } from '@d3-maps/vue'
import { useMapZoom } from '@d3-maps/vue'
import { easeCubicOut } from 'd3-ease'
import { useTemplateRef } from 'vue'

const zoomRef = useTemplateRef<MapZoomRef>('zoom')
const zoom = useMapZoom(zoomRef)
const transition = [
  // Wait first
  { delay: 150 },
  // Then animate the zoom
  { ease: easeCubicOut, duration: 500 },
]

function zoomIn() {
  zoom.scaleWith(0.5)
}

function zoomToCenter() {
  zoom.translateTo(0, 0, null, transition)
}

function resetZoom() {
  zoom.reset(transition)
}
</script>

<template>
  <button @click="zoomIn">
    Zoom in
  </button>
  <button @click="zoomToCenter">
    Center
  </button>
  <button @click="resetZoom">
    Reset
  </button>

  <MapZoom ref="zoom">
    <MapFeatures />
  </MapZoom>
</template>
```

== React

```tsx
import { MapZoom, MapFeatures, type MapZoomRef, useMapZoom } from '@d3-maps/react'
import { easeCubicOut } from 'd3-ease'
import { useRef } from 'react'

export function Example() {
  const zoomRef = useRef<MapZoomRef | null>(null)
  const zoom = useMapZoom(zoomRef)
  const transition = [
    // Wait first
    { delay: 150 },
    // Then animate the zoom
    { ease: easeCubicOut, duration: 500 },
  ]

  function zoomIn() {
    zoom.scaleWith(0.5)
  }

  function zoomToCenter() {
    zoom.translateTo(0, 0, null, transition)
  }

  function resetZoom() {
    zoom.reset(transition)
  }

  return (
    <>
      <button onClick={zoomIn}>
        Zoom in
      </button>
      <button onClick={zoomToCenter}>
        Center
      </button>
      <button onClick={resetZoom}>
        Reset
      </button>

      <MapZoom ref={zoomRef}>
        <MapFeatures />
      </MapZoom>
    </>
  )
}
```

:::

## Best Practice

- Use `useMapZoom` when commands are triggered outside the `MapZoom` subtree
- Use the `MapZoom` ref directly when you also need `container` or `zoomBehavior`
- Use [MapZoom](/components/map-zoom) `transition` for a shared default command transition

## Examples

- [Programmatic Zoom](/examples/programmatic-zoom)
