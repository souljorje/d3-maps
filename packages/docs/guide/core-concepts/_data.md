## Data

[MapBase](/components/map-base) accepts either GeoJSON or TopoJSON and then transforms it into GeoJSON.  
Both used for geo data encoding, but **TopoJSON is recommended**, it's smaller.

Simply pass `data` prop to render the basic map

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
