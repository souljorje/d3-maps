## Data

[MapFeatures](/components/map-features) accepts GeoJSON and TopoJSON, then normalizes them to map features: GeoJSON `Feature` objects and geometries.

:::tabs key:framework

== Vue

```vue [vue]
<template>
  <MapBase>
    <MapFeatures :data="data" />
  </MapBase>
</template>
```

== React

```tsx [react]
<MapBase>
  <MapFeatures data={data} />
</MapBase>
```

:::
