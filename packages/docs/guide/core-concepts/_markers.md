## Markers

Add any points to the map with [MapMarker](/components/map-marker)

- pass `coordinates` as `[longitude, latitude]`
- and any SVG elements as a children

::: code-group

```vue{8-11} [vue]
<template>
  <Map
    :data="data"
    :projection="geoMercator"
    :data-transformer="dataTransformer"
  >
    <MapZoom>
      <MapMarker :coordinates="[-83.0457538, 42.331427]">
        <text>Sweet home 🧡</text> 
        <circle r="3" />  
      </MapMarker>
      <MapFeatures />
      <MapMesh stroke="#fff" />
    </MapZoom>
  </Map>
</template>
```

:::
