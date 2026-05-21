## Styling

[MapElement](/components/map-element)*, [MapFeature](/components/map-feature), [MapMarker](/components/map-marker), [MapLine](/components/map-line), and [MapAnnotation](/components/map-annotation) expose a `styles` prop for interaction-state styling  

<!-- TODO: check if it works with Solid and svelte -->
```ts
const styles = {
  default: { fill: 'lightblue' }, // default state
  focus: { stroke: 'deepskyblue' }, // on keyboard focus
  hover: { fill: 'skyblue' }, // on hover
  active: { fill: 'lightskyblue' }, // on mousedown
}
```

:::tabs key:framework

== Vue

```vue{11} [vue]
<template>
  <MapBase
    :projection="geoEquirectangular"
  >
    <MapSphere />
    <MapZoom>
      <MapGraticule />
      <MapFeatures
        :data="data"
        :transformer="transformer"
        :styles="styles"
      />
      <MapMesh :data="data" stroke="#fff" />
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

```tsx{10} [react]
<MapBase
  projection={geoEquirectangular}
>
  <MapSphere />
  <MapZoom>
    <MapGraticule />
    <MapFeatures
      data={data}
      transformer={transformer}
      styles={styles}
    />
    <MapMesh data={data} stroke="#fff" />
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

The default stylesheet provides a shared base for map presentation

:::tabs key:framework-css

== Vue

```ts
import '@d3-maps/vue/style.css'
```

== React

```ts
import '@d3-maps/react/style.css'
```

:::

Plain CSS can also target the generated SVG elements directly

| Component | CSS selector |
| --- | --- |
| [MapBase](/components/map-base) | `.d3-map` |
| [MapFeatures](/components/map-features) | `[name="feature"]` |
| [MapMesh](/components/map-mesh) | `[name="mesh"]` |
| [MapMarker](/components/map-marker) | `[name="marker"]` |
| [MapGraticule](/components/map-graticule) lines | `[name="graticule"]` |
| [MapSphere](/components/map-sphere) | `[name="sphere"]` |
| [MapLine](/components/map-line) | `[name="line"]` |
| [MapAnnotation](/components/map-annotation) connector | `[name="annotation-line"]` |
| [MapZoom](/components/map-zoom) | `[name="zoom"]` |

See example (this site) [packages/docs/.vitepress/theme/custom.css](https://github.com/souljorje/d3-maps/blob/main/packages/docs/.vitepress/theme/custom.css)
