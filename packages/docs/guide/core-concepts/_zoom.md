## Zoom

Wrap layers with [MapZoom](/components/map-zoom) to enable pan and zoom

:::tabs key:framework

== Vue

```vue{7,11} [vue]
<template>
  <Map
    :data="data"
    :projection="geoEquirectangular"
    :data-transformer="dataTransformer"
  >
    <MapZoom>
      <MapGraticule border />
      <MapFeatures />
      <MapMesh stroke="#fff" />
    </MapZoom>
  </Map>
</template>
```

== React

```tsx{6,10} [react]
<Map
  data={data}
  projection={geoEquirectangular}
  dataTransformer={dataTransformer}
>
  <MapZoom>
    <MapGraticule border />
    <MapFeatures />
    <MapMesh stroke="#fff" />
  </MapZoom>
</Map>
```

:::

> Detailed zoom [usage example](/examples/zoom)
