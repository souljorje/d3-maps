## Data

[Map](/components/map) accepts either GeoJSON or TopoJSON and then transforms it into GeoJSON.  
Both used for geo data encoding, but **TopoJSON is recommended**, it's smaller.

Simply pass `data` prop to render the basic map

:::tabs key:framework

== Vue

```vue [vue]
<template>
  <Map :data="data">
    <MapFeatures />
  </Map>
</template>
```

== React

```tsx [react]
<Map data={data}>
  <MapFeatures />
</Map>
```

:::
