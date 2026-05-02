## Features

A feature is a geographic entity such as a country or state.  

[MapFeatures](/components/map-features) renders the full collection, while [MapFeature](/components/map-feature) renders a single one. The slot or render-function form exposes per-feature rendering control.

:::tabs key:framework

== Vue

```vue{7-15} [vue]
<template>
  <MapBase
    :data="data"
    :data-transformer="dataTransformer"
    :projection="geoEquirectangular"
  >
    <MapFeatures>
      <template #default="{ features }">
        <MapFeature
          v-for="feature in features"
          :key="feature.id"
          :data="feature"
        />
      </template>
    </MapFeatures>
  </MapBase>
</template>
```

== React

```tsx{6-17} [react]
<MapBase
  data={data}
  dataTransformer={dataTransformer}
  projection={geoEquirectangular}
>
  <MapFeatures>
    {({ features }) => (
      <>
        {features.map((feature) => (
          <MapFeature
            key={String(feature.id)}
            data={feature}
          />
        ))}
      </>
    )}
  </MapFeatures>
</MapBase>
```

:::
