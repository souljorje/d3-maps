## Markers

[MapMarker](/components/map-marker) projects a point onto the map and renders arbitrary SVG content there. Coordinates use `[longitude, latitude]`

:::tabs key:framework

== Vue

```vue{16-23} [vue]
<template>
  <MapBase
    :projection="geoEquirectangular"
  >
    <MapSphere
      fill="var(--vp-c-bg-alt)"
      stroke="var(--vp-c-border)"
    >
      <MapZoom>
        <MapGraticule />
        <MapFeatures
          :data="data"
          :transformer="transformer"
        />
        <MapMesh :data="data" stroke="#fff" />
        <MapMarker :coordinates="[-83.0457538, 42.331427]">
          <text
            font-size="14"
            y="-6"
            text-anchor="middle"
          >Sweet home 🧡</text>
          <circle r="3" />
        </MapMarker>
      </MapZoom>
    </MapSphere>
  </MapBase>
</template>
```

== React

```tsx{15-22} [react]
<MapBase
  projection={geoEquirectangular}
>
  <MapSphere
    fill="var(--vp-c-bg-alt)"
    stroke="var(--vp-c-border)"
  >
    <MapZoom>
      <MapGraticule />
      <MapFeatures
        data={data}
        transformer={transformer}
      />
      <MapMesh data={data} stroke="#fff" />
      <MapMarker coordinates={[-83.0457538, 42.331427]}>
        <text
          fontSize={14}
          y={-6}
          textAnchor={"middle"}
        >Sweet home 🧡</text>
        <circle r="3" />
      </MapMarker>
    </MapZoom>
  </MapSphere>
</MapBase>
```

:::

> See a [simple example](/examples/markers) and an example of [markers with zoom](/examples/zoom)
