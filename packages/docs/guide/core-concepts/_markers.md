## Markers

Add any points to the map with [MapMarker](/components/map-marker)

- pass `coordinates` as `[longitude, latitude]`
- and any SVG elements as a children

:::tabs key:framework

== Vue

```vue{9-12} [vue]
<template>
  <Map
    :data="data"
    :projection="geoMercator"
    :data-transformer="dataTransformer"
  >
    <MapZoom>
      <MapFeatures />
      <MapMarker :coordinates="[-83.0457538, 42.331427]">
        <text>Sweet home 🧡</text>
        <circle r="3" />
      </MapMarker>
      <MapMesh stroke="#fff" />
    </MapZoom>
  </Map>
</template>
```

== React

```tsx{8-11} [react]
<Map
  data={data}
  projection={geoMercator}
  dataTransformer={dataTransformer}
>
  <MapZoom>
    <MapFeatures />
    <MapMarker coordinates={[-83.0457538, 42.331427]}>
      <text>Sweet home 🧡</text>
      <circle r="3" />
    </MapMarker>
    <MapMesh stroke="#fff" />
  </MapZoom>
</Map>
```

:::
