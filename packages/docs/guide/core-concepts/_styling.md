## Styling

[MapFeature](/components/map-feature)*, [MapMarker](/components/map-marker), [MapMesh](/components/map-mesh), [MapGraticule](/components/map-graticule), [MapLine](/components/map-line), and [MapAnnotation](/components/map-annotation) accept a `styles` prop  

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

> \* [MapFeatures](/components/map-features) forwards `styles` to internally rendered `MapFeature`s

### CSS

1. Import [default stylesheet](https://github.com/souljorje/d3-maps/blob/main/packages/core/src/style.css) to simplify global map styles

:::tabs key:framework-css

== Core

```ts
import '@d3-maps/core/style.css'
```

== Vue

```ts
import '@d3-maps/vue/style.css'
```

== React

```ts
import '@d3-maps/react/style.css'
```

:::

2. Define styles for map components with plain CSS

| Component | CSS selector |
| --- | --- |
| [MapBase](/components/map-base) | `.d3-map` |
| [MapFeature](/components/map-feature) | `[name="feature"]` |
| [MapMesh](/components/map-mesh) | `[name="mesh"]` |
| [MapMarker](/components/map-marker) | `[name="marker"]` |
| [MapGraticule](/components/map-graticule) lines | `[name="graticule"]` |
| [MapGraticule](/components/map-graticule) border | `[name="border"]` |
| [MapGraticule](/components/map-graticule) background | `[name="background"]` |
| [MapLine](/components/map-line) | `[name="line"]` |
| [MapAnnotation](/components/map-annotation) connector | `[name="annotation-line"]` |
| [MapZoom](/components/map-zoom) | `[name="zoom"]` |

See example (this site) [packages/docs/.vitepress/theme/custom.css](https://github.com/souljorje/d3-maps/blob/main/packages/docs/.vitepress/theme/custom.css)
