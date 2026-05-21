## Projection

A projection transforms the Earth's curved surface into flat 2D coordinates. It defines the overall shape of the rendered map.

:::tabs key:framework

== Vue

```vue{2,7} [vue]
<script setup>
import { geoEquirectangular } from 'd3-geo'
</script>

<template>
  <MapBase
    :projection="geoEquirectangular"
  >
    <MapFeatures
      :data="data"
      :transformer="transformer"
    />
  </MapBase>
</template>
```

== React

```tsx{1,4} [react]
import { geoEquirectangular } from 'd3-geo'

<MapBase
  projection={geoEquirectangular}
>
  <MapFeatures
    data={data}
    transformer={transformer}
  />
</MapBase>
```

:::

::: details

- Projections are available in [d3-geo](https://github.com/d3/d3-geo) and [d3-geo-projection](https://github.com/d3/d3-geo-projection)
- `geoNaturalEarth1` from d3-geo is used by default
- [Observable projection gallery](https://observablehq.com/@fil/d3-projections) shows the visual differences
:::
