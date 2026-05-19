## Markers

[MapMarker](/components/map-marker) projects a point onto the map and renders arbitrary SVG content there. Coordinates use `[longitude, latitude]`

:::tabs key:framework

== Vue

```vue{12-19} [vue]
<template>
  <MapBase
    :data="data"
    :projection="geoEquirectangular"
    :data-transformer="dataTransformer"
  >
    <MapSphere />
    <MapZoom>
      <MapGraticule />
      <MapObjects />
      <MapMesh stroke="#fff" />
      <MapMarker :coordinates="[-83.0457538, 42.331427]">
        <text
          font-size="14"
          y="-6"
          text-anchor="middle"
        >Sweet home 🧡</text>
        <circle r="3" />
      </MapMarker>
    </MapZoom>
  </MapBase>
</template>
```

== React

```tsx{11-18} [react]
<MapBase
  data={data}
  projection={geoEquirectangular}
  dataTransformer={dataTransformer}
>
  <MapSphere />
  <MapZoom>
    <MapGraticule />
    <MapObjects />
    <MapMesh stroke="#fff" />
    <MapMarker coordinates={[-83.0457538, 42.331427]}>
      <text
        fontSize={14}
        y={-6}
        textAnchor={"middle"}
      >Sweet home 🧡</text>
      <circle r="3" />
    </MapMarker>
  </MapZoom>
</MapBase>
```

:::
