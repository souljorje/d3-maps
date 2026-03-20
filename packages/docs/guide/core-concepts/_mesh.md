## Mesh

To render borders use [MapMesh](/components/map-mesh) instead of applying `stroke`. It will render a single `<path>` (more efficient) and ensure borders don't overlap.

:::tabs key:framework

== Vue

```vue{8} [vue]
<template>
  <MapBase
    :data="data"
    :projection="geoEquirectangular"
    :data-transformer="dataTransformer"
  >
    <MapFeatures />
    <MapMesh stroke="#fff" />
  </MapBase>
</template>
```

== React

```tsx{7} [react]
<MapBase
  data={data}
  projection={geoEquirectangular}
  dataTransformer={dataTransformer}
>
  <MapFeatures />
  <MapMesh stroke="#fff" />
</MapBase>
```

:::

> Default stroke width is 0.5
