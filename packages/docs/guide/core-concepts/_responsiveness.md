## Responsiveness

Simply make it with an aspect-ratio wrapper and the `aspect-ratio` prop

::: code-group

```vue{2,7,21} [vue]
<template>
  <div style="aspect-ratio: 16 / 9">
    <Map
      :data="data"
      :projection="geoMercator"
      :data-transformer="dataTransformer"
      :aspect-ratio="16 / 9"
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
      </MapZoom>
    </Map>
  </div>
</template>
```

:::

::: details
[Map](/components/map) renders an `<svg>` with a `viewBox` and `width="auto" height="100%"`.  
Hence the **parent element must have height**, otherwise map will collapse.  
Under the hood `fitSize([width, height], geoJson)` is used. It fits the map perfectly into provided projection.
`16 / 9` is default aspectRatio
:::
