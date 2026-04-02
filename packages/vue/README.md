# @d3-maps/vue [![@d3-maps/vue bundle size](https://deno.bundlejs.com/badge?q=@d3-maps/vue&config={%22esbuild%22:{%22external%22:[%22vue%22]}})](https://bundlejs.com/?q=@d3-maps/vue&config={%22esbuild%22:{%22external%22:[%22vue%22]}})

Interactive SVG maps with Vue and D3.  

[**Docs**](https://d3-maps.netlify.app/guide) · [**Examples**](https://d3-maps.netlify.app/examples)

## Features

✨ Drop-in components, powerful defaults  
🧩 Zoom, drag, lines, markers, and more  
⚛️ Reactive rendering  
📱 Responsive by default  
🪶 Lightweight and tree-shakable  
🧑‍💻 Fully typed  
🗄️ SSR friendly  
🗺️ Supports TopoJSON and GeoJSON

## Installation

```bash
npm install @d3-maps/vue
```

```bash
pnpm add @d3-maps/vue
```

```bash
bun add @d3-maps/vue
```

```html
<script src="https://cdn.jsdelivr.net/npm/@d3-maps/vue"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@d3-maps/vue/style.css" />
```

## Usage

```html
<script setup lang="ts">
import type { MapData } from '@d3-maps/core'

import { MapBase, MapFeatures } from '@d3-maps/vue'
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

### Plugin

Registers all components in the app

```js
import { createApp } from 'vue'
import '@d3-maps/vue/style.css'
import { plugin as D3MapsVue } from '@d3-maps/vue'
import App from './App.vue'

createApp(App)
  .use(D3MapsVue)
  .mount('#app')
```

_Nuxt 3_ \
Create `~/plugins/d3-maps-vue.client.ts`:

```ts
import '@d3-maps/vue/style.css'
import { plugin as D3MapsVue } from '@d3-maps/vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(D3MapsVue)
})
```

## License

MIT licensed. Copyright © 2026 Georgii Bukharov. See [LICENCE](../../LICENCE) for more details.
