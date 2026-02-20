# Get started

d3-maps is a small set of building blocks for creating SVG maps with D3 projections, with framework adapters for reactivity and rendering.

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

::: code-group

```bash [npm]
npm install @d3-maps/vue
```

```bash [pnpm]
pnpm add @d3-maps/vue
```

```bash [bun]
bun add @d3-maps/vue
```

```bash [CDN]
https://unpkg.com/@d3-maps/core/index.iife.js
https://unpkg.com/@d3-maps/vue/index.iife.js
```

:::

## Basic usage

::: code-group

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

:::

## Next

Continue with [Core concepts](/guide/core-concepts/) to learn how to customize data, projections, responsiveness, styling, markers, and zoom.
