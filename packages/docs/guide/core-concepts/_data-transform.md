## Data transformation

Add `dataTransformer` to preprocess GeoJSON features before render

```ts
// e.g. don't render Antarctica 🇦🇶
function dataTransformer(features) {
  return features.filter((x) => x.properties?.name !== 'Antarctica')
}
```

::: code-group

```vue{5} [vue]
<template>
  <Map
    :data="data"
    :projection="geoMercator"
    :data-transformer="dataTransformer"
  >
    <MapFeatures />
  </Map>
</template>
```

:::
