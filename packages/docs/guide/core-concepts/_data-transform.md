## Data transformation

`transformer` preprocesses normalized GeoJSON objects before render. It is useful for filtering, enrichment, or normalization.

```ts
// e.g. don't render Antarctica 🇦🇶
function transformer(features) {
  return features.filter((feature) => (
    feature.properties.name !== 'Antarctica'
  ))
}
```

:::tabs key:framework

== Vue

```vue{5} [vue]
<template>
  <MapBase>
    <MapFeatures
      :data="data"
      :transformer="transformer"
    />
  </MapBase>
</template>
```

== React

```tsx{4} [react]
<MapBase>
  <MapFeatures
    data={data}
    transformer={transformer}
  />
</MapBase>
```

:::
