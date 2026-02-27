# Migrate from react-simple-maps

[@d3-maps/react](/components/) is fully compatible* with [react-simple-maps](https://www.react-simple-maps.io/)  
But in case feel free to open an [issue](https://github.com/souljorje/d3-maps/issues) or [pull request](https://github.com/souljorje/d3-maps/pulls)  
<sub>\* Line and Annotation in development</sub>

## Migration checklist

| Step | Change |
| --- | --- |
| Data | `Geographies.geography` -> `Map.data` |
| Data transform | `Geographies.parseGeographies` -> `Map.dataTransformer` |
| Style prop | `Geography.style` -> `MapFeature.styles` |
| Style state | `style.pressed` -> `styles.active` |
| Zoom wrapper | `ZoomableGroup` -> `MapZoom` |
| Marker | `Marker` -> `MapMarker` |
| Graticule | `Graticule` -> `MapGraticule` |
| Sphere | `Sphere` -> `MapGraticule` (`background`/`border`) |

## 1. Migrate data

`Geographies.geography` -> `Map.data`  
`Geographies.parseGeographies` -> `Map.dataTransformer`  
`Map.data` supports data objects, not URLs  
Data fetching remains non-opinionated

```tsx
import type { MapData } from '@d3-maps/core'
import { Map, MapFeatures } from '@d3-maps/react'
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
    <Map
      data={data}
      dataTransformer={(features) => features.filter((f) => f.properties?.name !== 'Antarctica')}
    >
      <MapFeatures />
    </Map>
  )
}
```

## 2. Rename style prop

`Geography.style` -> `MapFeature.styles`  
`style.pressed` -> `styles.active`

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
<Map data={data}>
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
</Map>
```

## 4. Rename marker component

`Marker` -> [MapMarker](/components/map-marker).

```tsx
<Map data={data}>
  <MapFeatures />
  <MapMarker coordinates={[-74.006, 40.7128]}>
    <circle r={4} fill="#ff6f26" />
    <text y={-8} textAnchor="middle" fontSize={12}>NYC</text>
  </MapMarker>
</Map>
```

## 5. Rename graticule component

`Graticule` -> [MapGraticule](/components/map-graticule).

```tsx
<Map data={data}>
  <MapGraticule stroke="#94a3b8" />
  <MapFeatures />
</Map>
```

## 6. Migrate sphere component

`Sphere` -> [MapGraticule](/components/map-graticule) with `background` and/or `border`.

```tsx
<Map data={data}>
  <MapGraticule background="#ffffff" border="#cbd5e1" />
  <MapFeatures />
</Map>
```

## Component mapping

| react-simple-maps | d3-maps |
| --- | --- |
| [`ComposableMap`](https://www.react-simple-maps.io/docs/composable-map/) | [Map](/components/map) |
| [`Geographies`](https://www.react-simple-maps.io/docs/geographies/) | [MapFeatures](/components/map-features) |
| [`Geography`](https://www.react-simple-maps.io/docs/geography/) | [MapFeature](/components/map-feature) |
| [`Marker`](https://www.react-simple-maps.io/docs/marker/) | [MapMarker](/components/map-marker) |
| [`ZoomableGroup`](https://www.react-simple-maps.io/docs/zoomable-group/) | [MapZoom](/components/map-zoom) |
| [`Graticule`](https://www.react-simple-maps.io/docs/graticule/) | [MapGraticule](/components/map-graticule) |
| [`Sphere`](https://www.react-simple-maps.io/docs/sphere/) | [MapGraticule](/components/map-graticule) (`background`/`border`) or a custom SVG layer |
| [`Annotation`](https://www.react-simple-maps.io/docs/annotation/) | Custom layer using [useMapObject](/hooks/use-map-object) + [useMapContext](/hooks/use-map-context) |
| [`Line`](https://www.react-simple-maps.io/docs/line/) | Custom layer using [useMapObject](/hooks/use-map-object) + [useMapContext](/hooks/use-map-context) |
