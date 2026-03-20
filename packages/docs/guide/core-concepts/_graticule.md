## Graticule

Use [MapGraticule](/components/map-graticule) to draw latitude and longitude grid lines

:::tabs key:framework

== Vue

```vue{7} [vue]
<template>
  <MapBase
    :data="data"
    :projection="geoEquirectangular"
    :data-transformer="dataTransformer"
  >
    <MapGraticule border />
    <MapFeatures />
    <MapMesh stroke="#fff" />
  </MapBase>
</template>
```

== React

```tsx{6} [react]
<MapBase
  data={data}
  projection={geoEquirectangular}
  dataTransformer={dataTransformer}
>
  <MapGraticule border />
  <MapFeatures />
  <MapMesh stroke="#fff" />
</MapBase>
```

:::
