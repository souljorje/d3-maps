## Data

[MapBase](/components/map-base) accepts GeoJSON, TopoJSON, or an array of either and normalizes everything to GeoJSON features before render. TopoJSON is compact, GeoJSON is rich.

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
