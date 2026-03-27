# getObjectZoomView

`getObjectZoomView` computes a centered zoom target for a map object

Use it when you want to zoom to a feature, marker geometry, or any other permissible geo object

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `context` | `Pick<MapContext, 'path' \| 'width' \| 'height'>` | `—` | Current map path generator and dimensions |
| `object` | `GeoPermissibleObjects` | `—` | Geo object to fit |
| `options?` | `ObjectZoomViewOptions` | `{}` | Optional `minZoom`, `maxZoom`, and `padding` |

## Return value

```ts
{
  center: [number, number]
  zoom: number
}
```

Returns `undefined` when the object has invalid or empty bounds

## Usage

```ts
const view = getObjectZoomView(context, feature, {
  minZoom: 1,
  maxZoom: 16,
})

if (view) {
  center = view.center
  zoom = view.zoom
}
```

See [zoom API](/api/core/zoom#getobjectzoomview)

## Examples

- [Programmatic Zoom](/examples/programmatic-zoom)
