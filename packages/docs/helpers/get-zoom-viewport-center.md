# getZoomViewportCenter

`getZoomViewportCenter` reads the projected map-space point currently centered in the viewport for a zoom transform

Use it when you need to derive a controlled `center` value from a live zoom event

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `context` | `Pick<MapContext, 'width' \| 'height'>` | `—` | Current viewport dimensions |
| `transform` | `Pick<ZoomTransform, 'invert'>` | `—` | Current zoom transform |

## Return value

Returns:

```ts
[number, number]
```

The projected map-space point currently centered in the viewport

## Usage

```ts
import { getZoomViewportCenter } from '@d3-maps/core'

const center = getZoomViewportCenter(context, event.transform)
```

See [zoom API](/api/core/zoom#getzoomviewportcenter)

## Examples

- [Programmatic Zoom](/examples/programmatic-zoom)
