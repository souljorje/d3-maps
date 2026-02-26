## Responsiveness

Simply make it with an aspect-ratio wrapper and the `aspect-ratio` prop

:::tabs key:framework

== Vue

```vue{2,7,22} [vue]
<template>
  <div style="aspect-ratio: 2 / 1">
    <Map
      :data="data"
      :projection="geoMercator"
      :data-transformer="dataTransformer"
      :aspect-ratio="2 / 1"
    >
      <MapZoom>
        <MapFeatures :styles="styles"/>
        <MapMarker 
          :styles="styles"
          :coordinates="[-83.0457538, 42.331427]"
        >
          <text>Sweet home 🧡</text> 
          <circle r="3" />  
        </MapMarker>
        <MapMesh stroke="#fff" />
        <MapGraticule stroke="#cbd5e1" />
      </MapZoom>
    </Map>
  </div>
</template>
```

== React

```tsx{1,6,23} [react]
<div style={{ aspectRatio: '2 / 1' }}>
  <Map
    data={data}
    projection={geoMercator}
    dataTransformer={dataTransformer}
    aspectRatio={2 / 1}
  >
    <MapZoom>
      <MapFeatures styles={styles} />
      <MapMarker
        styles={styles}
        coordinates={[-83.0457538, 42.331427]}
      >
        <text>Sweet home 🧡</text>
        <circle r="3" />
      </MapMarker>
      <MapMesh stroke="#fff" />
      <MapGraticule stroke="#cbd5e1" />
    </MapZoom>
  </Map>
</div>
```

:::

::: details
[Map](/components/map) renders an `<svg>` with a `viewBox` and `width="100%" height="auto"`.  
Hence the **parent element must have height**, otherwise map will collapse.  
Under the hood `fitExtent([[1, 1], [width - 1, height - 1]], { type: 'Sphere' }` is used.  
Overridable with `fitExtent | fitSize | fitWidth | fitHeight` passed to `projectionConfig`.
:::
