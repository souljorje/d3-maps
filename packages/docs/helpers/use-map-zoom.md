---
description: Helper for reading zoom state and zooming to map objects on D3 SVG maps with React and Vue
---

# useMapZoom

Reads the current zoom state from [MapZoom](/components/map-zoom)  
Use it inside `MapZoom` when you need zoom values  
Returns `undefined` if used outside `MapZoom`

## Return value

| Property | Type |
| --- | --- |
| `center` | `[number, number] \| undefined` |
| `zoom` | `number` |
| `minZoom` | `number` |
| `maxZoom` | `number` |
| `zoomToObject(object, callback)` | `(object: ZoomObject, callback: (view: ObjectZoomView) => void) => void` |

## `zoomToObject`

Computes a fitted zoom view for the given object and passes the full [`ObjectZoomView`](/api/core/zoom#objectzoomview) to the callback


:::

## Best Practice

- Use [useMapContext](/helpers/use-map-context) alongside it when controls need map features or the shared path generator
- Use `zoomToObject` to derive a fitted view, then hand the resulting `center` and `zoom` back to parent-controlled state
