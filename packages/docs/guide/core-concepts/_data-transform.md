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

```vue{4} [vue]
<template>
  <Map
    :data="data"
    :data-transformer="dataTransformer"
  >
    <MapFeatures />
  </Map>
</template>
```

== React

```tsx{3} [react]
<Map
  data={data}
  dataTransformer={dataTransformer}
>
  <MapFeatures />
</Map>
```

:::
