## Data

[MapBase](/components/map-base) accepts GeoJSON or TopoJSON and normalizes to GeoJSON before render. Both formats used for geo data encoding. TopoJSON is compact, GeoJSON is rich.

:::tabs key:framework

== Vue

```vue [vue]
<template>
  <MapBase :data="data">
    <MapFeatures />
  </MapBase>
</template>
```

== React

```tsx [react]
<MapBase data={data}>
  <MapFeatures />
</MapBase>
```

:::
