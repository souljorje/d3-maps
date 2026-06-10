# @d3-maps/vue <img src="https://raw.githubusercontent.com/souljorje/d3-maps/refs/heads/main/packages/docs/public/d3-maps-logo.svg" alt ="d3-maps logo" width="20" height="20"> [![CI](https://github.com/souljorje/d3-maps/actions/workflows/ci.yml/badge.svg)](https://github.com/souljorje/d3-maps/actions/workflows/ci.yml) [![Netlify Status](https://api.netlify.com/api/v1/badges/619b15fb-c666-48ed-9715-894474c88e35/deploy-status)](https://d3-maps.netlify.app) [![@d3-maps/vue bundle size](https://img.shields.io/bundlephobia/minzip/%40d3-maps%2Fvue?color=%2342b883)](https://bundlephobia.com/package/@d3-maps/vue)

Interactive SVG maps toolkit for Vue, powered by D3.  

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

## Install

```bash
npm install @d3-maps/vue
```

<details>
  <summary>pnpm, bun, CDN</summary>
  
  ```bash
  pnpm add @d3-maps/vue
  ```

  ```bash
  bun add @d3-maps/vue
  ```

  ```html
  <script type="module">
    import { MapBase, MapFeatures } from 'https://esm.sh/@d3-maps/vue'
    import 'https://esm.sh/@d3-maps/vue/style.css'
  </script>
  ```
</details>

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
  <MapBase>
    <MapFeatures :data="data" />
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

MIT licensed. Copyright © 2026 Georgii Bukharov. See [LICENCE](./LICENCE) for more details.
