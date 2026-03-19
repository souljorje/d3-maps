## Zoom

Wrap layers with [MapZoom](/components/map-zoom) to enable pan and zoom

:::tabs key:framework

== Vue

```vue{7,11} [vue]
<template>
  <MapBase
    :data="data"
    :projection="geoEquirectangular"
    :data-transformer="dataTransformer"
  >
    <MapZoom>
      <MapGraticule border />
      <MapFeatures />
      <MapMesh stroke="#fff" />
    </MapZoom>
  </MapBase>
</template>
```

== React

```tsx{6,10} [react]
<MapBase
  data={data}
  projection={geoEquirectangular}
  dataTransformer={dataTransformer}
>
  <MapZoom>
    <MapGraticule border />
    <MapFeatures />
    <MapMesh stroke="#fff" />
  </MapZoom>
</MapBase>
```

:::

> Detailed zoom [usage example](/examples/zoom)
