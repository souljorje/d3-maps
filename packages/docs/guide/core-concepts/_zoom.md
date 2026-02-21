## Zoom

Wrap layers with [MapZoom](/components/map-zoom) to enable pan and zoom

:::tabs key:framework

== Vue

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

== React

```tsx{7,10} [react]
<Map
  data={data}
  projection={geoMercator}
  dataTransformer={dataTransformer}
>
  <MapZoom>
    <MapFeatures />
    <MapMesh stroke="#fff" />
  </MapZoom>
</Map>
```

:::

> Detailed zoom [usage example](/examples/zoom)
