## Features

Map feature is geographic entity, e.g. country or state.  
[MapFeatures](/components/map-features) render all features internally, [MapFeature](/components/map-feature) renders a single feature. Switch to slot/render-function mode when each feature needs custom render logic

:::tabs key:framework

== Vue

```vue{6-14} [vue]
<template>
  <Map
    :data="data"
    :projection="geoMercator"
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
  </Map>
</template>
```

== React

```tsx{5-16} [react]
<Map
  data={data}
  projection={geoMercator}
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
</Map>
```

:::
