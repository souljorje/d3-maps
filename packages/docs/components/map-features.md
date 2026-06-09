---
description: Component for feature rendering on D3 SVG maps in React and Vue
---

# MapFeatures

Renders normalized map features from source data: GeoJSON `Feature` objects and geometries.

Features with `geometry: null` are preserved and receive no path data.

## Props

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `data?` | [MapData](/api/core/data#MapData) | — | TopoJSON or GeoJSON |
| `objectKey?` | `string` | — | TopoJSON object key for `data` |
| `transformer?` | [MapFeatureTransformer](/api/core/feature#mapfeaturetransformer) | — | Optional transform for normalized features |
| `styles?` | [InteractionProps['styles']](/api/core/interaction#property-styles) | — | Forwarded to default-rendered [MapFeature](/components/map-feature) instances |

Use native SVG presentation attrs like `fill` and `stroke` directly on `MapFeatures`

## Usage

:::tabs key:framework

== Vue

```vue
<template>
  <MapBase>
    <MapFeatures
      :data="mapData"
      object-key="countries"
      fill="darkorange"
      :styles="{
        default: { opacity: 0.9 },
        hover: { opacity: 0.7 },
        active: { stroke: '#1f2937', strokeWidth: 1.5 },
      }"
    />
  </MapBase>
</template>
```

== React

```tsx
<MapBase>
  <MapFeatures
    data={mapData}
    objectKey="countries"
    fill="darkorange"
    styles={{
      default: { opacity: 0.9 },
      hover: { opacity: 0.7 },
      active: { stroke: '#1f2937', strokeWidth: 1.5 },
    }}
  />
</MapBase>
```

:::

## Slots

:::tabs key:framework

== Vue

```vue
<template>
  <MapFeatures :data="mapData">
    <template #default="{ features }">
      <MapFeature
        v-for="feature in features"
        :key="feature.key"
        :d="feature.d"
        :aria-label="feature.properties.name"
        fill="darkorange"
      />
    </template>
  </MapFeatures>
</template>
```

== React

```tsx
<MapFeatures data={mapData}>
  {({ features }) => (
    features.map((feature) => (
      <MapFeature
        key={feature.key}
        d={feature.d}
        aria-label={feature.properties.name}
        fill="darkorange"
      />
    ))
  )}
</MapFeatures>
```

:::
