---
description: Migrate from react-simple-maps to @d3-maps/react with component, prop, styling, and zoom API equivalents
---

# Migrate from react-simple-maps

[@d3-maps/react](/components/) is fully compatible with [react-simple-maps](https://www.react-simple-maps.io/)  
But in case feel free to open an [issue](https://github.com/souljorje/d3-maps/issues) or pull request

## Migration checklist

| Step | Change |
| --- | --- |
| Data | `Geographies.geography` -> `MapBase.data` |
| Data transform | `Geographies.parseGeographies` -> `MapBase.dataTransformer` |
| Style prop | `Geography.style` -> `MapFeature.styles` |
| Style states | `style.pressed` -> `styles.active` |
| Zoom wrapper | `ZoomableGroup` -> `MapZoom` |
| Marker | `Marker` -> `MapMarker` |
| Line | `Line` -> `MapLine` |
| Annotation | `Annotation` -> `MapAnnotation` |
| Graticule | `Graticule` -> `MapGraticule` |
| Sphere | `Sphere` -> `MapGraticule` (`background`/`border`) |

## 1. Migrate data

- `Geographies.geography` -> `MapBase.data`  
  `MapBase.data` supports only data objects, not URLs, data fetching is non-opinionated
- `Geographies.parseGeographies` -> `MapBase.dataTransformer`  

```tsx
import type { MapData } from '@d3-maps/core'
import { MapBase, MapFeatures } from '@d3-maps/react'
import { useEffect, useState } from 'react'

export function WorldMap() {
  const [data, setData] = useState<MapData | null>(null)

  useEffect(() => {
    fetch('/world-110m.json')
      .then((res) => res.json())
      .then((json) => setData(json as MapData))
  }, [])

  if (!data) return null

  return (
    <MapBase
      data={data}
      dataTransformer={(features) => features.filter((f) => f.properties?.name !== 'Antarctica')}
    >
      <MapFeatures />
    </MapBase>
  )
}
```

## 2. Rename style prop

- `Geography.style` -> `MapFeature.styles`  
- `style.pressed` -> `styles.active`

This style model is supported by `MapFeature`, `MapFeatures`, `MapMarker`, `MapMesh`, and `MapGraticule`

```tsx
<MapFeature
  styles={{
    default: { fill: '#e2e8f0' },
    hover: { fill: '#fb923c' },
    active: { fill: '#ea580c' },
  }}
/>
```

You can still use plain SVG attributes like `fill`, `stroke`, and `strokeWidth` directly on map components.

## 3. Rename zoom component

`ZoomableGroup` -> `MapZoom` and rename events:
- `onMoveStart` -> `onZoomStart`
- `onMove` -> `onZoom`
- `onMoveEnd` -> `onZoomEnd`

```tsx
<MapBase data={data}>
  <MapZoom
    center={[0, 0]}
    zoom={1}
    minZoom={1}
    maxZoom={8}
    onZoomStart={() => {}}
    onZoom={() => {}}
    onZoomEnd={() => {}}
  >
    <MapFeatures />
  </MapZoom>
</MapBase>
```

## 4. Rename marker component

`Marker` -> [MapMarker](/components/map-marker).

```tsx
<MapMarker coordinates={[-74.006, 40.7128]}>
  <circle r={4} fill="#ff6f26" />
  <text y={-8} textAnchor="middle" fontSize={12}>NYC</text>
</MapMarker>
```

## 5. Rename graticule component

`Graticule` -> [MapGraticule](/components/map-graticule).

```tsx
<MapGraticule />
```

## 6. Migrate sphere component

`Sphere` -> [MapGraticule](/components/map-graticule) with `background` and/or `border`.

```tsx
<MapGraticule background="#eee" border="#333" />
```

## 7. Rename line component

`Line` -> [MapLine](/components/map-line)

`react-simple-maps` line props map directly to `MapLine.coordinates`

```tsx
<MapLine
  coordinates={[
    [-74.006, 40.7128],
    [-118.2437, 34.0522],
  ]}
/>
```

## 8. Migrate annotation component

`Annotation` -> [MapAnnotation](/components/map-annotation)

```tsx
<MapBase data={data}>
  <MapFeatures />
  <MapAnnotation
    coordinates={[2.3522, 48.8566]}
    length={36}
    angle={-35}
    margin={10}
    stroke="#ff6f26"
    strokeWidth={2}
  >
    <text
      y={-6}
      textAnchor="middle"
      fontSize={12}
    >
      Paris
    </text>
  </MapAnnotation>
</MapBase>
```

## Component mapping

| react-simple-maps | d3-maps |
| --- | --- |
| [ComposableMap](https://www.react-simple-maps.io/docs/composable-map/) | [MapBase](/components/map-base) |
| [Geographies](https://www.react-simple-maps.io/docs/geographies/) | [MapFeatures](/components/map-features) |
| [Geography](https://www.react-simple-maps.io/docs/geography/) | [MapFeature](/components/map-feature) |
| [Marker](https://www.react-simple-maps.io/docs/marker/) | [MapMarker](/components/map-marker) |
| [Line](https://www.react-simple-maps.io/docs/line/) | [MapLine](/components/map-line) |
| [ZoomableGroup](https://www.react-simple-maps.io/docs/zoomable-group/) | [MapZoom](/components/map-zoom) |
| [Graticule](https://www.react-simple-maps.io/docs/graticule/) | [MapGraticule](/components/map-graticule) |
| [Sphere](https://www.react-simple-maps.io/docs/sphere/) | [MapGraticule](/components/map-graticule) (`background`/`border`) or a custom SVG layer |
| [Annotation](https://www.react-simple-maps.io/docs/annotation/) | [MapAnnotation](/components/map-annotation) |
