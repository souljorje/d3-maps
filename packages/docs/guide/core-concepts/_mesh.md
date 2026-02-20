## Mesh

To render borders use [MapMesh](/components/MapMesh) instead of applying `stroke`. It will render a single `<path>` (more efficient) and ensure borders don't overlap.

::: code-group

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

:::

> Default stroke width is set to 0.5
