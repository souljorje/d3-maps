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
  <MapBase
    :data="data"
    :data-transformer="dataTransformer"
  >
    <MapFeatures />
  </MapBase>
</template>
```

== React

```tsx{3} [react]
<MapBase
  data={data}
  dataTransformer={dataTransformer}
>
  <MapFeatures />
</MapBase>
```

:::
