---
description: Interactive SVG maps for React and Vue. Choropleth & bubble maps, markers, lines, zoom and more. Powered by D3. GeoJSON & TopoJSON suppport.
---

# Get started

`d3-maps` is a toolkit for interactive SVG maps in React and Vue. Reactive components, pure SVG and D3.js power without low-level wiring.

Let's build your first map 👇

## Install

::::tabs key:framework

=== Vue

:::tabs key:package-manager

== npm

```bash
npm install @d3-maps/vue
```

== pnpm

```bash
pnpm add @d3-maps/vue
```

== bun

```bash
bun add @d3-maps/vue
```

== CDN

```html
<script type="module">
  import { createApp } from 'https://esm.sh/vue@3'
  import { MapBase, MapFeatures } from 'https://esm.sh/@d3-maps/vue'
  import 'https://esm.sh/@d3-maps/vue/style.css'
</script>
```

:::

=== React

:::tabs key:package-manager

== npm

```bash
npm install @d3-maps/react
```

== pnpm

```bash
pnpm add @d3-maps/react
```

== bun

```bash
bun add @d3-maps/react
```

== CDN

```html
<script type="module">
  import React from 'https://esm.sh/react@19'
  import { createRoot } from 'https://esm.sh/react-dom@19/client'
  import { MapBase, MapFeatures } from 'https://esm.sh/@d3-maps/react'
  import 'https://esm.sh/@d3-maps/react/style.css'
</script>
```

:::

::::

## Load data

Load a map data object first

```ts
const { default: data } = await import('@d3-maps/atlas/world/countries/countries-110m')
```

See [Atlas](/guide/atlas) for more maps

## Render the map

Pass the data to `MapFeatures`

:::tabs key:framework

== Vue

```vue [vue]
<script setup lang="ts">
import { MapBase, MapFeatures, type MapData } from '@d3-maps/vue'
defineProps<{
  data: MapData
}>()
</script>

<template>
  <MapBase>
    <MapFeatures :data="data" />
  </MapBase>
</template>
```

== React

```tsx [react]
import '@d3-maps/react/style.css'
import { MapBase, MapFeatures, type MapData } from '@d3-maps/react'

export function MapView({ data }: { data: MapData }) {
  return (
    <MapBase>
      <MapFeatures data={data} />
    </MapBase>
  )
}
```

:::

## Result

<Demo component-name="basic-map"/>

## When to use

| Case | Supported | Notes |
|---|:---:|---|
| SVG map charts | ✅ | Choropleth, bubble, heatmap, etc |
| Components API | ✅ | React & Vue packages |
| GeoJSON/TopoJSON rendering | ✅ | Renders to SVG |
| Markers, lines, annotations | ✅ | Framework-native components |
| Zoomable maps | ✅ | SVG zoom and pan |
| Full chart workflow | ⚠️ | Use amCharts, Highcharts or Plot |
| Low-level map rendering | ⚠️ | Use D3.js for full control |
| Real-world map apps | ❌ | Use Leaflet or MapLibre |
| Data-heavy 3D maps | ❌ | Use MapLibre |

## Migrate from react-simple-maps

`@d3-maps/react` is fully compatible with `react-simple-maps`, supports React 19 an has more features under the hood. See [migration guide](/guide/migration-from-react-simple-maps)