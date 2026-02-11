# Responsiveness

[Map](/components/map) renders an `<svg>` with a `viewBox` and `width="auto" height="100%"`.  
That means **the parent element controls the final size**.  
The map will never overflow the parent element or stretch unnaturally, it will always be rendered according to it's projection.  

::: details
d3-maps uses `fitSize([width, height], geoJson)` to fit the map into the provided size.
:::

## Recommended pattern

Use an aspect-ratio wrapper and aspect-ratio prop:

```vue
<template>
  <div class="map-shell">
    <Map
      v-if="data"
      :data="data"
      :aspect-ratio="4 / 3"
    >
      <MapFeatures />
    </Map>
  </div>
</template>

<style>
.map-shell {
  width: 100%;
  aspect-ratio: 4 / 3;
}
</style>
```

## Core defaults

`@d3-maps/core` computes map size with these defaults when values are not provided:

- `width = 600`
- `aspectRatio = 16 / 9`
- `height = width / aspectRatio` (unless `height` is explicitly set)

`width`/`height` define the internal coordinate system used by:

- projection fitting
- path rendering
- zoom translate extents (by default)

For most cases, keep core defaults and only control final rendered size through the parent wrapper and aspect-ratio prop.
