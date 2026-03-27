---
description: Component for GeoJSON feature rendering on D3 SVG maps in React and Vue
---

# MapFeatures

Renders all GeoJSON features from the current map context

## Props

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `idKey?` | `string` | `id` | See [`getFeatureKey`](/api/core/feature#getfeaturekey) |
| `styles?` | [MapObject['styles']](/api/core/mapObject#property-styles) | — | Forwarded to [MapFeature](/components/map-feature#props) in default rendering mode, see [styling guide](/guide/core-concepts/#styling) |

Use native SVG presentation attrs like `fill` and `stroke` directly on `MapFeatures`

## Usage

:::tabs key:framework

== Vue

```vue
<template>
  <MapBase :data="mapData">
    <MapFeatures
      fill="darkorange"
      :styles="{
        default: { opacity: 0.9 },
        hover: { opacity: 0.7 },
        active: { stroke: '#1f2937', strokeWidth: 1.5 },
      }"
    />
    <MapMesh stroke="slategray" />
  </MapBase>
</template>
```

== React

```tsx
<MapBase data={mapData}>
  <MapFeatures
    fill="darkorange"
    styles={{
      default: { opacity: 0.9 },
      hover: { opacity: 0.7 },
      active: { stroke: '#1f2937', strokeWidth: 1.5 },
    }}
  />
  <MapMesh stroke="slategray" />
</MapBase>
```

:::

## Slots

:::tabs key:framework

== Vue

```vue
<template>
  <MapFeatures #default="{ features }">
    <MapFeature
      v-for="feature in features"
      :fill="feature.color"
      :key="feature.id"
      :data="feature"
    />
  </MapFeatures>
</template>
```

== React

```tsx
<MapFeatures>
  {({ features }) => (
    <g>
      {features.map((feature) => (
        <MapFeature
          key={String(feature.id)}
          data={feature}
          fill={String(feature.color)}
        />
      ))}
    </g>
  )}
</MapFeatures>
```

:::
