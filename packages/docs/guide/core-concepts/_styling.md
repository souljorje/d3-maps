## Styling

[MapFeature](/components/map-feature)*, [MapMarker](/components/map-marker), and [MapMesh](/components/map-mesh) accept a `styles` prop  

<!-- TODO: check if it works with Solid and svelte -->
```ts
const styles = {
  default: { fill: 'green' }, // default state
  hover: { fill: 'green', opacity: 0.8 }, // on hover
  active: { fill: 'darkgreen' }, // on click or focus
}
```

::: code-group

```vue{3-4} [vue]
<template>
  <Map :data="data">
    <MapMarker :styles="styles"/>
    <MapFeatures :styles="styles"/>
  </Map>
</template>
```

:::

> \* [MapFeatures](/components/map-features) forwards `styles` to internally rendered `MapFeature`'s
