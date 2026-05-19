## Zoom

[MapZoom](/components/map-zoom) adds pan and zoom behavior with `d3-zoom`  

:::tabs key:framework

== Vue

```vue{8,12} [vue]
<template>
  <MapBase
    :data="data"
    :projection="geoEquirectangular"
    :data-transformer="dataTransformer"
  >
    <MapSphere />
    <MapZoom>
      <MapGraticule />
      <MapObjects />
      <MapMesh stroke="#fff" />
    </MapZoom>
  </MapBase>
</template>
```

== React

```tsx{7,11} [react]
<MapBase
  data={data}
  projection={geoEquirectangular}
  dataTransformer={dataTransformer}
>
  <MapSphere />
  <MapZoom>
    <MapGraticule />
    <MapObjects />
    <MapMesh stroke="#fff" />
  </MapZoom>
</MapBase>
```

:::

See the [zoom example](/examples/zoom) for details
