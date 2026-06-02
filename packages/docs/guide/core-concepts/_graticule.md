## Sphere and Graticule 

[MapSphere](/components/map-sphere) renders map outline and background. [MapGraticule](/components/map-graticule) renders latitude and longitude grid lines.

:::tabs key:framework

== Vue

```vue{5-6,12} [vue]
<template>
  <MapBase
    :projection="geoEquirectangular"
  >
    <MapSphere fill="var(--vp-c-bg-alt)" />
    <MapGraticule />
    <MapFeatures
      :data="data"
      :transformer="transformer"
    />
    <MapMesh :data="data" stroke="#fff" />
    <MapSphere stroke="var(--vp-c-border)" />
  </MapBase>
</template>
```

== React

```tsx{4-5,11} [react]
<MapBase
  projection={geoEquirectangular}
>
  <MapSphere fill="var(--vp-c-bg-alt)" />
  <MapGraticule />
  <MapFeatures
    data={data}
    transformer={transformer}
  />
  <MapMesh data={data} stroke="#fff" />
  <MapSphere stroke="var(--vp-c-border)" />
</MapBase>
```

:::
