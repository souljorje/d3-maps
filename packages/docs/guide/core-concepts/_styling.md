## Styling

[MapFeature](/components/map-feature)*, [MapMarker](/components/map-marker), [MapMesh](/components/map-mesh), and [MapGraticule](/components/map-graticule) accept a `styles` prop  

<!-- TODO: check if it works with Solid and svelte -->
```ts
const styles = {
  default: { fill: 'lightblue' }, // default state
  hover: { fill: 'skyblue' }, // on hover
  active: { fill: 'lightskyblue' }, // on mousedown
}
```

:::tabs key:framework

== Vue

```vue{9} [vue]
<template>
  <MapBase
    :data="data"
    :projection="geoEquirectangular"
    :data-transformer="dataTransformer"
  >
    <MapZoom>
      <MapGraticule border />
      <MapFeatures :styles="styles"/>
      <MapMesh stroke="#fff" />
      <MapMarker :coordinates="[-83.0457538, 42.331427]">
        <text
          font-size="14"
          y="-6"
          text-anchor="middle"
        >Sweet home 🧡</text>
        <circle r="3" />
      </MapMarker>
    </MapZoom>
  </MapBase>
</template>
```

== React

```tsx{8} [react]
<MapBase
  data={data}
  projection={geoEquirectangular}
  dataTransformer={dataTransformer}
>
  <MapZoom>
    <MapGraticule border />
    <MapFeatures styles={styles} />
    <MapMesh stroke="#fff" />
    <MapMarker coordinates={[-83.0457538, 42.331427]}>
      <text
        fontSize={14}
        y={-6}
        textAnchor={"middle"}
      >Sweet home 🧡</text>
      <circle r="3" />
    </MapMarker>
  </MapZoom>
</MapBase>
```

:::

> \* [MapFeatures](/components/map-features) forwards `styles` to internally rendered `MapFeature`'s

### CSS

You can define styles for map components via plain CSS

| Component | CSS selector |
| --- | --- |
| Global defaults | `:root` |
| [MapBase](/components/map-base) | `.d3-map` |
| [MapFeature](/components/map-feature) | `[name="feature"]` |
| [MapMesh](/components/map-mesh) | `[name="mesh"]` |
| [MapMarker](/components/map-marker) | `[name="marker"]` |
| [MapGraticule](/components/map-graticule) lines | `[name="graticule"]` |
| [MapGraticule](/components/map-graticule) border | `[name="border"]` |
| [MapGraticule](/components/map-graticule) background | `[name="background"]` |
| [MapZoom](/components/map-zoom) | `[name="zoom"]` |

Source: [packages/core/src/index.css](https://github.com/souljorje/d3-maps/blob/main/packages/core/src/index.css)  
Example (this site): [packages/docs/.vitepress/theme/custom.css](https://github.com/souljorje/d3-maps/blob/main/packages/docs/.vitepress/theme/custom.css)
