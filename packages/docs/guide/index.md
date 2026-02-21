# Introduction

`d3-maps` is a set of building blocks and helpers for creating SVG maps with D3.  
Works with your favorite framework, batteries included.

## Architecture

**Core** hides framework-agnostic complex logic under the hood *(you won't see it)*

- Context creation, data transformation
- Map layers types and models: features, markers, zoom, etc
- Utilities for custom layers: choropleth, bubble, etc

**Adapters** implement the core in a simple way *(you'll see it)*

- Vue / React / Svelte / Solid bindings
- Rendering and reactivity integration
- Declarative components and composables

## Installation

:::tabs key:framework

== Vue

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

== React

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

:::

## Basic usage

:::tabs key:framework

== Vue

```vue [vue]
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { withBase } from 'vitepress'

const data = ref<unknown>()

onMounted(async () => {
  const response = await fetch(withBase('/example-data/countries-110m.json'))
  data.value = await response.json()
})
</script>

<template>
  <Map v-if="data" :data="data">
    <MapFeatures />
  </Map>
</template>
```

== React

```tsx [react]
import { Map, MapFeatures } from '@d3-maps/react'

export function App({ data }: { data: unknown }) {
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
