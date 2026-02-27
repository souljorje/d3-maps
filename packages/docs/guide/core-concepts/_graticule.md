## Graticule

Use [MapGraticule](/components/map-graticule) to draw latitude and longitude grid lines

:::tabs key:framework

== Vue

```vue{7} [vue]
<template>
  <Map
    :data="data"
    :projection="geoEquirectangular"
    :data-transformer="dataTransformer"
  >
    <MapGraticule border />
    <MapFeatures />
    <MapMesh stroke="#fff" />
  </Map>
</template>
```

== React

```tsx{6} [react]
<Map
  data={data}
  projection={geoEquirectangular}
  dataTransformer={dataTransformer}
>
  <MapGraticule border />
  <MapFeatures />
  <MapMesh stroke="#fff" />
</Map>
```

:::
