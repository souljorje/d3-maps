# MapMarker

Positions anything on the map based on coordinates

## Props

| Parameter | Type | Default value | Description |
| --- | --- | --- | --- |
| `coordinates?` | `[number, number]` | — | Marker coordinates in `[longitude, latitude]` format. |
| `styles?` | [MapObjectStyles](/api/core/mapObject#mapobjectstyles) | — | See [styling guide](/guide/core-concepts/#styling) |

## Events

<!--@include: ./_map-object-events.md-->

## Usage

:::tabs key:framework

== Vue

<<< ../.vitepress/examples/markers.vue

== React

<<< ../.vitepress/examples/react/markers.tsx

:::
