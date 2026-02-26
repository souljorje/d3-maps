## Zoom

Wrap layers with [MapZoom](/components/map-zoom) to enable pan and zoom

:::tabs key:framework

== Vue

```vue{7,11} [vue]
<template>
  <Map
    :data="data"
    :projection="geoMercator"
    :data-transformer="dataTransformer"
  >
    <MapZoom>
      <MapFeatures />
      <MapMesh stroke="#fff" />
      <MapGraticule stroke="#cbd5e1" />
    </MapZoom>
  </Map>
</template>
```

== React

```tsx{6,10} [react]
<Map
  data={data}
  projection={geoMercator}
  dataTransformer={dataTransformer}
>
  <MapZoom>
    <MapFeatures />
    <MapMesh stroke="#fff" />
    <MapGraticule stroke="#cbd5e1" />
  </MapZoom>
</Map>
```

:::

> Detailed zoom [usage example](/examples/zoom)
