## Graticule

Use [MapGraticule](/components/map-graticule) to draw latitude and longitude grid lines on top of map layers

:::tabs key:framework

== Vue

```vue{9} [vue]
<template>
  <Map
    :data="data"
    :projection="geoMercator"
    :data-transformer="dataTransformer"
  >
    <MapFeatures />
    <MapMesh stroke="#fff" />
    <MapGraticule stroke="#cbd5e1" />
  </Map>
</template>
```

== React

```tsx{8} [react]
<Map
  data={data}
  projection={geoMercator}
  dataTransformer={dataTransformer}
>
  <MapFeatures />
  <MapMesh stroke="#fff" />
  <MapGraticule stroke="#cbd5e1" />
</Map>
```

:::
