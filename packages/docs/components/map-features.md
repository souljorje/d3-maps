---
description: Component for default GeoJSON feature rendering on D3 SVG maps in React and Vue
---

# MapFeatures

Renders normalized map features from source data

## Props

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `data?` | [MapData](/api/core/data#MapData) | — | Layer data source |
| `objectKey?` | `string` | — | TopoJSON object key for `data` |
| `transformer?` | `(features) => features` | — | Optional layer-local transform for normalized features |
| `styles?` | [MapObject['styles']](/api/core/object#property-styles) | — | Forwarded to default-rendered [MapObject](/components/map-object) instances |

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
      <MapObject
        v-for="feature in features"
        :key="feature.key"
        :d="feature.d"
        :fill="isFeature(feature) ? 'darkorange' : 'none'"
      />
    </template>
  </MapFeatures>
</template>

<script setup lang="ts">
import { isFeature } from '@d3-maps/vue'
</script>
```

== React

```tsx
import { isFeature } from '@d3-maps/react'

<MapFeatures data={mapData}>
  {({ features }) => (
    features.map((feature) => (
      <MapObject
        key={feature.key}
        d={feature.d}
        fill={isFeature(feature) ? 'darkorange' : 'none'}
      />
    ))
  )}
</MapFeatures>
```

:::
