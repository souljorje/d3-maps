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

:::tabs key:framework

== Vue

```vue{8,10} [vue]
<template>
  <Map
    :data="data"
    :projection="geoMercator"
    :data-transformer="dataTransformer"
  >
    <MapZoom>
      <MapFeatures :styles="styles"/>
      <MapMarker 
        :styles="styles"
        :coordinates="[-83.0457538, 42.331427]"
      >
        <text>Sweet home 🧡</text> 
        <circle r="3" />  
      </MapMarker>
      <MapMesh stroke="#fff" />
    </MapZoom>
  </Map>
</template>
```

== React

```tsx{7,9} [react]
<Map
  data={data}
  projection={geoMercator}
  dataTransformer={dataTransformer}
>
  <MapZoom>
    <MapFeatures styles={styles} />
    <MapMarker
      styles={styles}
      coordinates={[-83.0457538, 42.331427]}
    >
      <text>Sweet home 🧡</text>
      <circle r="3" />
    </MapMarker>
    <MapMesh stroke="#fff" />
  </MapZoom>
</Map>
```

:::

> \* [MapFeatures](/components/map-features) forwards `styles` to internally rendered `MapFeature`'s
