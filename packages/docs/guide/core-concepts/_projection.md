## Projection

A map projection transforms the Earth's 3D curved surface into SVG map.  
It determines how exactly map will look.  

By default `geoEqualEarth` is used in core, but you can provide your own:

::: code-group

```vue{2,8} [vue]
<script setup>
import { geoMercator } from 'd3-geo-projection'
</script>

<template>
  <Map
    :data="data"
    :projection="geoMercator"
  >
    <MapFeatures />
  </Map>
</template>
```

:::

::: details

- You can tweak a projection with [Map.projectionConfig](/components/map/#props) (defaults are strong though)
- Projections are available in [d3-geo](https://github.com/d3/d3-geo) and [d3-geo-projection](https://github.com/d3/d3-geo-projection)
- Here you can see [visualized projections](https://observablehq.com/@fil/d3-projections)
:::
