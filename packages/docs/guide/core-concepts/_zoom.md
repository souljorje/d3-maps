## Zoom

[MapZoom](/components/map-zoom) adds pan and zoom behavior. Note: wrap only elements you want to zoom, e.g. `MapSphere` here doesn't need zoom.  

:::tabs key:framework

== Vue

```vue{6-13} [vue]
<template>
  <MapBase
    :projection="geoEquirectangular"
  >
    <MapSphere fill="var(--vp-c-bg-alt)" />
    <MapZoom>
      <MapGraticule />
      <MapFeatures
        :data="data"
        :transformer="transformer"
      />
      <MapMesh :data="data" stroke="#fff" />
    </MapZoom>
    <MapSphere stroke="var(--vp-c-border)" />
  </MapBase>
</template>
```

== React

```tsx{5-12} [react]
<MapBase
  projection={geoEquirectangular}
>
  <MapSphere fill="var(--vp-c-bg-alt)" />
  <MapZoom>
    <MapGraticule />
    <MapFeatures
      data={data}
      transformer={transformer}
    />
    <MapMesh data={data} stroke="#fff" />
  </MapZoom>
  <MapSphere stroke="var(--vp-c-border)" />
</MapBase>
```

:::

> See [detailed example](/examples/zoom) and [programmatic zoom](/examples/programmatic-zoom) example
