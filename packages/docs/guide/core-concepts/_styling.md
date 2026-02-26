## Styling

[MapFeature](/components/map-feature)*, [MapMarker](/components/map-marker), [MapMesh](/components/map-mesh), and [MapGraticule](/components/map-graticule) accept a `styles` prop  

<!-- TODO: check if it works with Solid and svelte -->
```ts
const styles = {
  default: { fill: 'green' }, // default state
  hover: { fill: 'green', opacity: 0.8 }, // on hover
  active: { fill: 'darkgreen' }, // on mousedown
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
      <MapGraticule stroke="#cbd5e1" />
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
    <MapGraticule stroke="#cbd5e1" />
  </MapZoom>
</Map>
```

:::

> \* [MapFeatures](/components/map-features) forwards `styles` to internally rendered `MapFeature`'s

### CSS

You can define styles for map components via plain CSS

| Component | CSS selector |
| --- | --- |
| Global defaults | `:root` |
| [Map](/components/map) | `.d3-map` |
| [MapFeature](/components/map-feature) | `[name="feature"]` |
| [MapMesh](/components/map-mesh) | `[name="mesh"]` |
| [MapMarker](/components/map-marker) | `[name="marker"]` |
| [MapGraticule](/components/map-graticule) lines | `[name="graticule"]` |
| [MapGraticule](/components/map-graticule) border | `[name="border"]` |
| [MapGraticule](/components/map-graticule) background | `[name="background"]` |
| [MapZoom](/components/map-zoom) | `[name="zoom"]` |

Source: [packages/core/src/index.css](https://github.com/souljorje/d3-maps/blob/main/packages/core/src/index.css)  
Example (this site): [packages/docs/.vitepress/theme/custom.css](https://github.com/souljorje/d3-maps/blob/main/packages/docs/.vitepress/theme/custom.css)
