## Styling

[MapFeature](/components/map-feature)*, [MapMarker](/components/map-marker), [MapMesh](/components/map-mesh), and [MapGraticule](/components/map-graticule) accept a `styles` prop  

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

You can define global styles for map components by targeting selectors inside `.d3-map`

| Component | CSS selector | Default values |
| --- | --- | --- |
| Global defaults | `:root` | `--d3-map-stroke-w: 0.5` |
| [Map](/components/map) | `.d3-map` | `height: 100%; width: auto; max-width: 100%` |
| [MapFeatures](/components/map-features) | `[name="features"]` | — |
| [MapFeature](/components/map-feature) | `[name="feature"]` | `stroke-width: var(--d3-map-stroke-w)` |
| [MapMarker](/components/map-marker) | `[name="marker"]` | — |
| [MapMesh](/components/map-mesh) | `[name="mesh"]` | `stroke-width: var(--d3-map-stroke-w)` |
| [MapGraticule](/components/map-graticule) lines | `[name="graticule"]` | `stroke-width: var(--d3-map-stroke-w)` |
| [MapGraticule](/components/map-graticule) background | `[name="background"]` | `stroke-width: var(--d3-map-stroke-w)` |
| [MapGraticule](/components/map-graticule) border | `[name="border"]` | `stroke-width: var(--d3-map-stroke-w * 2)` |
| [MapZoom](/components/map-zoom) content | `[name="zoom"] path` | `vector-effect: non-scaling-stroke` |

Source: [packages/core/src/index.css](https://github.com/souljorje/d3-maps/blob/main/packages/core/src/index.css)
