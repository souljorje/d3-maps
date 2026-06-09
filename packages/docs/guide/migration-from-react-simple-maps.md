---
description: Migration guide from react-simple-maps to @d3-maps/react, covering component, prop, styling, and zoom API equivalents
---

# Migrate from react-simple-maps

[@d3-maps/react](/components/) is fully compatible with [react-simple-maps](https://www.react-simple-maps.io/), supports React 19 an has more features under the hood.  

Feel free to open an [issue](https://github.com/souljorje/d3-maps/issues) or a pull request if something is missing.

## Migration checklist

| Step | Change |
| --- | --- |
| Data | `Geographies.geography` -> `MapFeatures.data` |
| Data transform | `Geographies.parseGeographies` -> `MapFeatures.transformer` |
| Fit | `ComposableMap` sizing + geography bounds -> `MapBase.fit` |
| Style prop | `Geography.style` -> `MapFeature.styles` |
| Style states | `style.pressed` -> `styles.active` |
| Zoom wrapper | `ZoomableGroup` -> `MapZoom` |
| Marker | `Marker` -> `MapMarker` |
| Line | `Line` -> `MapLine` |
| Annotation | `Annotation` -> `MapAnnotation` |
| Graticule | `Graticule` -> `MapGraticule` |
| Sphere | `Sphere` -> `MapSphere` |

## 1. Migrate data

- `Geographies.geography` -> `MapFeatures.data`  
- `Geographies.parseGeographies` -> `MapFeatures.transformer`  

```tsx
import { MapBase, MapFeatures } from '@d3-maps/react'
import { use, useCallback } from 'react'

const mapDataPromise = import('@d3-maps/atlas/world/countries/countries-110m').then((m) => m.default as MapData)

export function WorldMap() {
  const data = use(mapDataPromise)
  const filterAntarctica = useCallback((features) => {
    return features.filter((f) => f.properties?.name !== 'Antarctica')
  }, [])

  return (
    <MapBase>
      <MapFeatures
        data={data}
        transformer={filterAntarctica}
      />
    </MapBase>
  )
}
```

## 2. Rename style prop

- `Geography.style` -> `MapFeature.styles`  
- `style.pressed` -> `styles.active`

```tsx
<MapFeature
  styles={{
    default: { fill: '#e2e8f0' },
    hover: { fill: '#fb923c' },
    active: { fill: '#ea580c' },
  }}
/>
```

You can still use plain SVG attributes like `fill`, `stroke`, and `strokeWidth` directly on map components

## 3. Rename zoom component

`ZoomableGroup` -> `MapZoom` and rename events:
- `onMoveStart` -> `onZoomStart`
- `onMove` -> `onZoom`
- `onMoveEnd` -> `onZoomEnd`

```tsx
<MapBase>
  <MapZoom
    minZoom={1}
    maxZoom={8}
    onZoomStart={() => {}}
    onZoom={() => {}}
    onZoomEnd={() => {}}
  >
    <MapFeatures data={data} />
  </MapZoom>
</MapBase>
```

## 4. Rename marker component

`Marker` -> [MapMarker](/components/map-marker)

```tsx
<MapMarker coordinates={[-74.006, 40.7128]}>
  <circle r={4} fill="#ff6f26" />
  <text y={-8} textAnchor="middle" fontSize={12}>NYC</text>
</MapMarker>
```

## 5. Rename graticule component

`Graticule` -> [MapGraticule](/components/map-graticule)

```tsx
<MapGraticule />
```

## 6. Migrate sphere component

`Sphere` -> [MapSphere](/components/map-sphere)

```tsx
<MapSphere fill="#eee" stroke="#999">
  <MapFeatures data={mapData} />
</MapSphere>
```

## 7. Rename line component

`Line` -> [MapLine](/components/map-line)

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
<MapBase>
  <MapFeatures data={data} />
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
| [Sphere](https://www.react-simple-maps.io/docs/sphere/) | [MapSphere](/components/map-sphere) or a custom SVG layer |
| [Annotation](https://www.react-simple-maps.io/docs/annotation/) | [MapAnnotation](/components/map-annotation) |
