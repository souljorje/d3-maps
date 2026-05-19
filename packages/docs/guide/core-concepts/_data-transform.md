## Data transformation

`dataTransformer` preprocesses normalized GeoJSON objects before render. It is useful for filtering, enrichment, or normalization.

```ts
// e.g. don't render Antarctica 🇦🇶
function dataTransformer(objects) {
  return objects.filter((object) => object.type !== 'Feature' || object.properties?.name !== 'Antarctica')
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
    <MapObjects />
  </MapBase>
</template>
```

== React

```tsx{3} [react]
<MapBase
  data={data}
  dataTransformer={dataTransformer}
>
  <MapObjects />
</MapBase>
```

:::
