## Features

A feature is a geographic entity such as a country or state.

[MapFeatures](/components/map-features) renders the full collection, while [MapObject](/components/map-object) is the low-level primitive for custom single-feature rendering. The slot or render-function form exposes per-feature rendering control.

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
        <MapObject
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
        <MapObject
          key={feature.key}
          d={feature.d}
        />
      ))
    }
  </MapFeatures>
</MapBase>
```

:::
