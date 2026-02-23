# Introduction

**d3-maps** is a set of components and helpers simplifying creating SVG maps with [D3](https://d3js.org/).  
Works with your favorite framework, batteries included.

## Architecture

**Core** hides framework-agnostic complex logic under the hood *(you won't see it)*

- Context creation, data transformation
- Map layers types and models: features, markers, zoom, etc
- Utilities for custom layers: choropleth, bubble, etc

**Adapters** implement the core in a simple way *(you'll see it)*

- Vue and React bindings, Solid and Svelte coming soon
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
https://unpkg.com/@d3-maps/core/index.iife.js
https://unpkg.com/@d3-maps/vue/index.iife.js
```

:::

=== React

Requires React 19+

::: tip Next.js
- `@d3-maps/react` entrypoints are client-only (`'use client'`)
- Import it from Client Components in the App Router (still SSR-rendered)
- Fetch data on the server and pass it as the `data` prop
- React Server Components entrypoints are planned
:::

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
https://unpkg.com/@d3-maps/core/index.iife.js
https://unpkg.com/@d3-maps/react/index.iife.js
```

:::

::::

## Basic usage

```ts
import type { MapData } from '@d3-maps/core'
const data: MapData = await fetch('/some-topojson.json').then((res) => res.json())
```

:::tabs key:framework

== Vue

```vue [vue]
<script setup lang="ts">
import { Map, MapFeatures } from '@d3-maps/vue'
defineProps<{
  data: MapData
}>()
</script>

<template>
  <Map :data="data">
    <MapFeatures />
  </Map>
</template>
```

== React

```tsx [react]
import { Map, MapFeatures } from '@d3-maps/react'

export function MapView({ data }: { data: MapData }) {
  return (
    <Map data={data}>
      <MapFeatures />
    </Map>
  )
}
```

:::

## Next

Continue with [Core concepts](/guide/core-concepts/) to learn how to customize data, projections, responsiveness, styling, markers, and zoom.
