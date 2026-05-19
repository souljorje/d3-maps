## Mesh

[MapMesh](/components/map-mesh) renders shared borders as one `<path>`. This avoids double-stroked edges that appear when every feature draws its own border. Mesh default stroke width is `0.5`

:::tabs key:framework

== Vue

```vue{8} [vue]
<template>
  <MapBase
    :data="data"
    :projection="geoEquirectangular"
    :data-transformer="dataTransformer"
  >
    <MapObjects />
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
  <MapObjects />
  <MapMesh stroke="#fff" />
</MapBase>
```

:::
