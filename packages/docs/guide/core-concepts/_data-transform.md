## Data transformation

Add `dataTransformer` to preprocess GeoJSON features before render

```ts
// e.g. don't render Antarctica 🇦🇶
function dataTransformer(features) {
  return features.filter((x) => x.properties?.name !== 'Antarctica')
}
```

:::tabs key:framework

== Vue

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

== React

```tsx{4} [react]
<Map
  data={data}
  projection={geoMercator}
  dataTransformer={dataTransformer}
>
  <MapFeatures />
</Map>
```

:::
