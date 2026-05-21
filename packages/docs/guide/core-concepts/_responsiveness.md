## Responsiveness

`MapBase` renders an SVG with `viewBox`, `width="100%"`, and `height="auto"`. Responsive layouts usually pair a parent aspect-ratio wrapper with the `aspectRatio` prop

:::tabs key:framework

== Vue

```vue{2,5} [vue]
<template>
  <div style="aspect-ratio: 2 / 1">
    <MapBase
      :projection="geoEquirectangular"
      :aspect-ratio="2 / 1"
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
  </div>
</template>
```

== React

```tsx{1,4} [react]
<div style="aspect-ratio: 2 / 1">
  <MapBase
    projection={geoEquirectangular}
    aspectRatio={2 / 1}
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
</div>
```

:::

::: details
The **parent element must have height**, otherwise the map collapses.

By default the projection uses:  
`fitExtent([[padding, padding], [width - padding, height - padding]], { type: 'Sphere' })`

Top-level `fit` defaults to `sphere`. `projectionConfig.padding` defaults to `1`. Explicit `fitExtent`, `fitSize`, `fitWidth`, or `fitHeight` override the built-in fit flow
:::
