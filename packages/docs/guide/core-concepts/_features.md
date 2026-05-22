## Features

A feature is any natural or human-made geographic object: country, road, land, river, etc.

[MapFeatures](/components/map-features) renders the full collection, while [MapFeature](/components/map-feature) handles custom single-feature rendering. The slot or render-function form exposes per-feature rendering control.

:::tabs key:framework

== Vue

```vue{5-16} [vue]
<template>
  <MapBase
    :projection="geoEquirectangular"
  >
    <MapFeatures
      :data="data"
      :transformer="transformer"
    >
      <template #default="{ features }">
        <MapFeature
          v-for="feature in features"
          :key="feature.key"
          :d="feature.d"
        />
      </template>
    </MapFeatures>
  </MapBase>
</template>
```

== React

```tsx{4-16} [react]
<MapBase
  projection={geoEquirectangular}
>
  <MapFeatures
    data={data}
    transformer={transformer}
  >
    {({ features }) =>
      features.map((feature) => (
        <MapFeature
          key={feature.key}
          d={feature.d}
        />
      ))
    }
  </MapFeatures>
</MapBase>
```

:::
