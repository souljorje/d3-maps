## Sphere and Graticule 

[MapGraticule](/components/map-graticule) renders latitude and longitude grid lines. Use [MapSphere](/components/map-sphere) for the map outline and background

:::tabs key:framework

== Vue

```vue{7} [vue]
<template>
  <MapBase
    :data="data"
    :projection="geoEquirectangular"
    :data-transformer="dataTransformer"
  >
    <MapSphere />
    <MapGraticule />
    <MapObjects />
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
  <MapSphere />
  <MapGraticule />
  <MapObjects />
  <MapMesh stroke="#fff" />
</MapBase>
```

:::
