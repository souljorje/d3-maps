## Mesh

To render borders use [MapMesh](/components/map-mesh) instead of applying `stroke`. It will render a single `<path>` (more efficient) and ensure borders don't overlap.

:::tabs key:framework

== Vue

```vue{8} [vue]
<template>
  <Map
    :data="data"
    :projection="geoMercator"
    :data-transformer="dataTransformer"
  >
    <MapFeatures />
    <MapMesh stroke="#fff" />
  </Map>
</template>
```

== React

```tsx{7} [react]
<Map
  data={data}
  projection={geoMercator}
  dataTransformer={dataTransformer}
>
  <MapFeatures />
  <MapMesh stroke="#fff" />
</Map>
```

:::

> Default stroke width is 0.5
