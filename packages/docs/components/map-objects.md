---
description: Component for default GeoJSON object rendering on D3 SVG maps in React and Vue
---

# MapObjects

Renders normalized map objects from the current map context.

It accepts shared `MapBase` data by default, and it can override that source per layer with its own `data` and `objectKey` props.

## Props

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `data?` | [MapDataSource](/api/core/data#MapDataSource) | — | Optional layer-local data source. Falls back to `MapBase` context data |
| `objectKey?` | `string` | — | Optional TopoJSON object key. Falls back to `MapBase` context object key |
| `dataTransformer?` | `(objects) => objects` | — | Optional layer-local transform for normalized objects |
| `styles?` | [MapObject['styles']](/api/core/mapObject#property-styles) | — | Forwarded to default-rendered [MapObject](/components/map-object) instances |

Use native SVG presentation attrs like `fill` and `stroke` directly on `MapObjects`.

## Usage

:::tabs key:framework

== Vue

```vue
<template>
  <MapBase
    :data="mapData"
    object-key="countries"
  >
    <MapObjects
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
<MapBase
  data={mapData}
  objectKey="countries"
>
  <MapObjects
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
  <MapObjects #default="{ objects }">
    <MapObject
      v-for="object in objects"
      :key="object.key"
      :d="object.d"
      :fill="isFeature(object) ? 'darkorange' : 'none'"
    />
  </MapObjects>
</template>

<script setup lang="ts">
import { isFeature } from '@d3-maps/vue'
</script>
```

== React

```tsx
import { isFeature } from '@d3-maps/react'

<MapObjects>
  {({ objects }) => (
    <g>
      {objects.map((object) => (
        <MapObject
          key={object.key}
          d={object.d}
          fill={isFeature(object) ? 'darkorange' : 'none'}
        />
      ))}
    </g>
  )}
</MapObjects>
```

:::
