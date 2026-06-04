## Zoom

[MapZoom](/components/map-zoom) adds pan and zoom behavior.

:::tabs key:framework

== Vue

```vue{5,17} [vue]
<template>
  <MapBase
    :projection="geoEquirectangular"
  >
    <MapZoom>
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
    </MapZoom>
  </MapBase>
</template>
```

== React

```tsx{4,16} [react]
<MapBase
  projection={geoEquirectangular}
>
  <MapZoom>
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
  </MapZoom>
</MapBase>
```

:::

> See [detailed example](/examples/zoom) and [programmatic zoom](/examples/programmatic-zoom) example
