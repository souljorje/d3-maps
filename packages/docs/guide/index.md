---
description: Guide for building simple interactive SVG map with React, Vue, and D3
---

# Get started

`d3-maps` is a set of components and helpers simplifying creating SVG maps with [D3](https://d3js.org/).  
Works with your favorite framework, batteries included.

Let's build your first map with `d3-maps` 👇

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
const { default: data } = await import('world-atlas/countries-110m.json')
```

## Render the map

Pass the data to `MapBase`

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
  <MapBase :data="data">
    <MapFeatures />
  </MapBase>
</template>
```

== React

```tsx [react]
import '@d3-maps/react/style.css'
import { MapBase, MapFeatures, type MapData } from '@d3-maps/react'

export function MapView({ data }: { data: MapData }) {
  return (
    <MapBase data={data}>
      <MapFeatures />
    </MapBase>
  )
}
```

:::

## Result

<Demo component-name="basic"/>
