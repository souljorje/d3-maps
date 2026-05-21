## Data

[MapFeatures](/components/map-features) accepts GeoJSON, TopoJSON then normalizes everything to renderable GeoJSON objects before render.

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
