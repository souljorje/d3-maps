## Graticule

Use [MapGraticule](/components/map-graticule) to draw latitude and longitude grid lines

:::tabs key:framework

== Vue

```vue{7} [vue]
<template>
  <Map
    :data="data"
    :projection="geoMercator"
    :data-transformer="dataTransformer"
  >
    <MapGraticule stroke="#cbd5e1" />
    <MapFeatures />
    <MapMesh stroke="#fff" />
  </Map>
</template>
```

== React

```tsx{6} [react]
<Map
  data={data}
  projection={geoMercator}
  dataTransformer={dataTransformer}
>
  <MapGraticule stroke="#cbd5e1" />
  <MapFeatures />
  <MapMesh stroke="#fff" />
</Map>
```

:::
