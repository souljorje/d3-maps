# MapMarker

Positions anything on the map based on coordinates

## Props

| Parameter | Type | Default value | Description |
| --- | --- | --- | --- |
| `coordinates` | `[number, number]` | — | Marker coordinates in `[longitude, latitude]` format. |
| `styles` | [MapObjectStyles](/api/core/mapObject#mapobjectstyles) | — | See [styling guide](/getting-started/styling) |

## Events

`mouseenter` `mouseleave` `mousedown` `mouseup` `focus` `blur`

## Usage

::: code-group

<<< ../.vitepress/examples/markers.vue[vue]
<<< ../.vitepress/examples/react/markers.tsx[react]

:::
