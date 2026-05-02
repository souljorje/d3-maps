## Zoom

[MapZoom](/components/map-zoom) adds pan and zoom behavior with `d3-zoom`  

:::tabs key:framework

== Vue

```vue{7,11} [vue]
<template>
  <MapBase
    :data="data"
    :projection="geoEquirectangular"
    :data-transformer="dataTransformer"
  >
    <MapZoom>
      <MapGraticule border />
      <MapFeatures />
      <MapMesh stroke="#fff" />
    </MapZoom>
  </MapBase>
</template>
```

== React

```tsx{6,10} [react]
<MapBase
  data={data}
  projection={geoEquirectangular}
  dataTransformer={dataTransformer}
>
  <MapZoom>
    <MapGraticule border />
    <MapFeatures />
    <MapMesh stroke="#fff" />
  </MapZoom>
</MapBase>
```

:::

See the [zoom example](/examples/zoom) for details
