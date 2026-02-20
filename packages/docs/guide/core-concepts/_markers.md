## Markers

Add any points to the map with [MapMarker](/components/MapMarker)

- pass `coordinates` as `[longitude, latitude]`
- and any SVG elements as a children

::: code-group

```vue{4-7} [vue]
<template>
  <Map :data="data">
    <MapZoom>
      <MapMarker :coordinates=[-83.0457538, 42.331427]>
        <text>Sweet home 🧡</text> 
        <circle r="3" />  
      </MapMarker>
    </MapZoom>
  </Map>
</template>
```

:::
