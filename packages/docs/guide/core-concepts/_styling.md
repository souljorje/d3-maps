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

```vue{14} [vue]
<template>
  <MapBase
    :projection="geoEquirectangular"
  >
    <MapSphere
      fill="var(--vp-c-bg-alt)"
      stroke="var(--vp-c-border)"
    >
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
    </MapSphere>
  </MapBase>
</template>
```

== React

```tsx{13} [react]
<MapBase
  projection={geoEquirectangular}
>
  <MapSphere
    fill="var(--vp-c-bg-alt)"
    stroke="var(--vp-c-border)"
  >
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
  </MapSphere>
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

Use plain CSS to style components globally

| Component | CSS selector |
| --- | --- |
| [MapBase](/components/map-base) | `.d3-map` |
| [MapFeatures](/components/map-features) | `[data-d3m="feature"]` |
| [MapMesh](/components/map-mesh) | `[data-d3m="mesh"]` |
| [MapMarker](/components/map-marker) | `[data-d3m="marker"]` |
| [MapGraticule](/components/map-graticule) | `[data-d3m="graticule"]` |
| [MapSphere](/components/map-sphere) | `[data-d3m="sphere"]`, `[data-d3m="sphere-background"]`, `[data-d3m="sphere-border"]` |
| [MapLine](/components/map-line) | `[data-d3m="line"]` |
| [MapAnnotation](/components/map-annotation) | `[data-d3m="annotation-line"]` |
| [MapZoom](/components/map-zoom) | `[data-d3m="zoom"]` |

See example (this site) [packages/docs/.vitepress/theme/custom.css](https://github.com/souljorje/d3-maps/blob/main/packages/docs/.vitepress/theme/custom.css)
