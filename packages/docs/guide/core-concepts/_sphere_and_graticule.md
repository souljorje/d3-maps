## Sphere and Graticule 

[MapSphere](/components/map-sphere) renders background and outline.  
[MapGraticule](/components/map-graticule) renders latitude and longitude grid lines.

:::tabs key:framework

== Vue

```vue{5-9,15} [vue]
<template>
  <MapBase
    :projection="geoEquirectangular"
  >
    <MapSphere
      fill="var(--vp-c-bg-alt)"
      stroke="var(--vp-c-border)"
    >
      <MapGraticule />
      <MapFeatures
        :data="data"
        :transformer="transformer"
      />
      <MapMesh :data="data" stroke="#fff" />
    </MapSphere>
  </MapBase>
</template>
```

== React

```tsx{4-8,14} [react]
<MapBase
  projection={geoEquirectangular}
>
  <MapSphere
    fill="var(--vp-c-bg-alt)"
    stroke="var(--vp-c-border)"
  >
    <MapGraticule />
    <MapFeatures
      data={data}
      transformer={transformer}
    />
    <MapMesh data={data} stroke="#fff" />
  </MapSphere>
</MapBase>
```

:::
