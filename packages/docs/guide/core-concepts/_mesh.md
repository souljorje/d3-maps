## Mesh

[MapMesh](/components/map-mesh) renders shared borders as one `<path>`. This avoids double-stroked edges that appear when every feature draws its own border.

:::tabs key:framework

== Vue

```vue{9} [vue]
<template>
  <MapBase
    :projection="geoEquirectangular"
  >
    <MapFeatures
      :data="data"
      :transformer="transformer"
    />
    <MapMesh :data="data" stroke="#fff" />
  </MapBase>
</template>
```

== React

```tsx{8} [react]
<MapBase
  projection={geoEquirectangular}
>
  <MapFeatures
    data={data}
    transformer={transformer}
  />
  <MapMesh data={data} stroke="#fff" />
</MapBase>
```

:::
