## Data

[MapBase](/components/map-base) accepts GeoJSON, TopoJSON, wrapped TopoJSON objects, or arrays, then normalizes everything to renderable GeoJSON objects before render. TopoJSON is compact, GeoJSON is rich.

:::tabs key:framework

== Vue

```vue [vue]
<template>
  <MapBase :data="data">
    <MapObjects />
  </MapBase>
</template>
```

== React

```tsx [react]
<MapBase data={data}>
  <MapObjects />
</MapBase>
```

:::
