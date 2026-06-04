## Zoom

[MapZoom](/components/map-zoom) adds pan and zoom behavior. Wrap `MapZoom` inside `MapSphere` so the sphere border stays visually stable while map content zooms.

:::tabs key:framework

== Vue

```vue{9-16} [vue]
<template>
  <MapBase
    :projection="geoEquirectangular"
  >
    <MapSphere
      fill="var(--vp-c-bg-alt)"
      stroke="var(--vp-c-border)"
    >
      <MapZoom>
        <MapGraticule />
        <MapFeatures
          :data="data"
          :transformer="transformer"
        />
        <MapMesh :data="data" stroke="#fff" />
      </MapZoom>
    </MapSphere>
  </MapBase>
</template>
```

== React

```tsx{8-15} [react]
<MapBase
  projection={geoEquirectangular}
>
  <MapSphere
    fill="var(--vp-c-bg-alt)"
    stroke="var(--vp-c-border)"
  >
    <MapZoom>
      <MapGraticule />
      <MapFeatures
        data={data}
        transformer={transformer}
      />
      <MapMesh data={data} stroke="#fff" />
    </MapZoom>
  </MapSphere>
</MapBase>
```

:::

> See [detailed example](/examples/zoom) and [programmatic zoom](/examples/programmatic-zoom) example
