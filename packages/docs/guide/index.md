# Introduction

**d3-maps** is a set of components and helpers simplifying creating SVG maps with [D3](https://d3js.org/).  
Works with your favorite framework, batteries included.

## Architecture

**Core** provides framework-agnostic complex logic *(you won't see it)*

- Context creation, data transformation
- Map layers types and models: features, markers, zoom, etc
- Utilities for custom layers: choropleth, bubble, etc

**Adapters** implement the core in a simple way *(you'll see it)*

- Vue and React bindings (Solid and Svelte coming soon)
- Rendering and reactivity integration
- Declarative components and composables

## Installation

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

```bash
https://cdn.jsdelivr.net/npm/@d3-maps/vue@0.8.0/index.css
https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.prod.js
https://cdn.jsdelivr.net/npm/@d3-maps/vue@0.8.0
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

```bash
https://cdn.jsdelivr.net/npm/@d3-maps/react@0.5.0/index.css
https://cdn.jsdelivr.net/npm/react@19/umd/react.production.min.js
https://cdn.jsdelivr.net/npm/@d3-maps/react@0.5.0
```

:::

::::

## CDN support

- `jsDelivr` and `UNPKG` support package-root script URLs for `@d3-maps/core`, `@d3-maps/react`, and `@d3-maps/vue`
- browser styles are available from the adapter packages at `@d3-maps/react/index.css` and `@d3-maps/vue/index.css`
- `esm.sh` and `Skypack` use the package ESM entrypoints, so prefer package-root imports there
- `cdnjs` is not an npm mirror, so publishing to npm does not make `@d3-maps/*` available there automatically

## Basic usage

1. Get data

```ts
import '@d3-maps/vue/index.css'
import type { MapData } from '@d3-maps/vue'
const data: MapData = await fetch('/some-topojson.json').then((res) => res.json())
```

2. Pass the data to `MapBase`

:::tabs key:framework

== Vue

```vue [vue]
<script setup lang="ts">
import '@d3-maps/vue/index.css'
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
import '@d3-maps/react/index.css'
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

3. Your first map is ready

<Demo component-name="basic"/>

## Next

Learn [core concepts](/guide/core-concepts/) to understand how **d3-maps** works step by step: data, projection, zoom, markers and more.
