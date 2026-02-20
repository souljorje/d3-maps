## Responsiveness

Simply make it with an aspect-ratio wrapper and the `aspect-ratio` prop

::: code-group

```vue{2,5} [vue]
<template>
  <div style="aspect-ratio: 4 / 3">
    <Map 
      :data="data" 
      :aspect-ratio="4 / 3"
    >
      <MapFeatures />
    </Map>
  </div>
</template>
```

:::

::: details
[Map](/components/map) renders an `<svg>` with a `viewBox` and `width="auto" height="100%"`.  
Hence the **parent element must have height**, otherwise map will collapse.  
Under the hood `fitSize([width, height], geoJson)` is used. It fits the map perfectly into provided projection.
:::
