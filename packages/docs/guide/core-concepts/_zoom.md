## Zoom

Wrap layers with [MapZoom](/components/map-zoom) to enable pan and zoom

::: code-group

```vue{7,10} [vue]
<template>
  <Map
    :data="data"
    :projection="geoMercator"
    :data-transformer="dataTransformer"
  >
    <MapZoom>
      <MapFeatures />
      <MapMesh stroke="#fff" />
    </MapZoom>
  </Map>
</template>
```

:::

> Detailed zoom [usage example](/examples/zoom)