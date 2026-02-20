## Data

[Map](/components/map) accepts either GeoJSON or TopoJSON, then transforming it into GeoJSON internally.  
Both used for geo data encoding, but **TopoJSON is recommended**, it's smaller.

Just pass `data` prop to render the basic map

::: code-group

```vue [vue]
<template>
  <Map :data="data">
    <MapFeatures />
  </Map>
</template>
```

:::
