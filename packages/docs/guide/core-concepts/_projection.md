## Projection

A projection transforms the Earth's curved surface into flat 2D coordinates. It defines the overall shape of the rendered map.

Projections are available in [d3-geo](https://github.com/d3/d3-geo) and [d3-geo-projection](https://github.com/d3/d3-geo-projection). `geoNaturalEarth1` is used by default.

:::tabs key:framework

== Vue

```vue{2,9} [vue]
<script setup>
import { geoEquirectangular } from 'd3-geo'
</script>

<template>
  <MapBase
    :data="data"
    :data-transformer="dataTransformer"
    :projection="geoEquirectangular"
  >
    <MapObjects />
  </MapBase>
</template>
```

== React

```tsx{1,6} [react]
import { geoEquirectangular } from 'd3-geo'

<MapBase
  data={data}
  dataTransformer={dataTransformer}
  projection={geoEquirectangular}
>
  <MapObjects />
</MapBase>
```

:::

::: details

- [MapBase.projectionConfig](/components/map-base#props) customizes projection methods
- [Observable projection gallery](https://observablehq.com/@fil/d3-projections) shows the visual differences
:::
