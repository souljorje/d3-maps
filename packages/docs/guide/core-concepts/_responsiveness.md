## Responsiveness

Simply make it with an aspect-ratio wrapper and the `aspect-ratio` prop

:::tabs key:framework

== Vue

```vue{2,7} [vue]
<template>
  <div style="aspect-ratio: 2 / 1">
    <MapBase
      :data="data"
      :projection="geoEquirectangular"
      :data-transformer="dataTransformer"
      :aspect-ratio="2 / 1"
    >
      <MapZoom>
        <MapGraticule border />
        <MapFeatures :styles="styles"/>
        <MapMesh stroke="#fff" />
        <MapMarker :coordinates="[-83.0457538, 42.331427]">
          <text
            font-size="14"
            y="-6"
            text-anchor="middle"
          >Sweet home 🧡</text>
          <circle r="3" />
      </MapMarker>
      </MapZoom>
    </MapBase>
  </div>
</template>
```

== React

```tsx{1,6,9,11,14,16} [react]
<div style={{ aspectRatio: "2 / 1" }}>
  <MapBase
    data={data}
    projection={geoEquirectangular}
    dataTransformer={dataTransformer}
    aspectRatio={2 / 1}
  >
    <MapZoom>
      <MapGraticule border />
      <MapFeatures styles={styles} />
      <MapMesh stroke="#fff" />
      <MapMarker coordinates={[-83.0457538, 42.331427]}>
        <text
          fontSize={14}
          y={-6}
          textAnchor={"middle"}
        >Sweet home 🧡</text>
        <circle r="3" />
      </MapMarker>
    </MapZoom>
  </MapBase>
</div>
```

:::

::: details
[MapBase](/components/map-base) renders an `<svg>` with a `viewBox` and `width="100%" height="auto"`.  
Hence the **parent element must have height**, otherwise map will collapse.  
Under the hood `fitExtent([[1, 1], [width - 1, height - 1]], { type: 'Sphere' }` is used.  
Overridable with `fitExtent | fitSize | fitWidth | fitHeight` passed to `projectionConfig`.
:::
