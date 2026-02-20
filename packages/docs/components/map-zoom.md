# MapZoom

Enables zoom and drag behavior using `d3-zoom`.

Wrap layers that should be zoomed inside [MapZoom](/components/map-zoom).

## Props

| Parameter | Type | Default value | Description |
| --- | --- | --- | --- |
| `center?` | `[number, number]` | `[0, 0]` | Initial center for zoom behavior |
| `zoom?` | `number` | `1` | Initial zoom level |
| `minZoom?` | `number` | `1` | Minimum zoom scale |
| `maxZoom?` | `number` | `8` | Maximum zoom scale |
| `translateExtent?` | [Extent](/api/core/zoom#extent) | map size bounds | Optional panning bounds |

## Events

Emits:

- `zoomstart`
- `zoom`
- `zoomend`

## Usage

::: code-group

<<< ../.vitepress/examples/zoom.vue[vue]

:::
