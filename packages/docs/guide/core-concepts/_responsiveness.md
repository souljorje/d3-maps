## Responsiveness

`MapBase` renders an SVG with `viewBox`, `width="100%"`, and `height="auto"`. Responsive layouts usually pair a parent aspect-ratio wrapper with the `aspectRatio` prop

:::tabs key:framework

== Vue

```vue{2,7} [vue]
<template>
  <div style="aspect-ratio: 2 / 1">
    <MapBase
      :data="data"
      :projection="geoEquirectangular"
      :data-transformer="dataTransformer"
      :aspect-ratio="2 / 1"
    >
      <MapSphere />
      <MapZoom>
        <MapGraticule />
        <MapObjects :styles="styles"/>
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
  </div>
</template>
```

== React

```tsx{1,6} [react]
<div style={{ aspectRatio: "2 / 1" }}>
  <MapBase
    data={data}
    projection={geoEquirectangular}
    dataTransformer={dataTransformer}
    aspectRatio={2 / 1}
  >
    <MapSphere />
    <MapZoom>
      <MapGraticule />
      <MapObjects styles={styles} />
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
</div>
```

:::

::: details
The **parent element must have height**, otherwise the map collapses.

By default the projection uses:  
`fitExtent([[padding, padding], [width - padding, height - padding]], { type: 'Sphere' })`  

Top-level `fit` defaults to shared `data` when present, otherwise `sphere`. `projectionConfig.padding` defaults to `1`, and explicit `fitExtent`, `fitSize`, `fitWidth`, or `fitHeight` still override the built-in fit flow
:::
