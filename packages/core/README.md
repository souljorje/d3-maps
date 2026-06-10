# d3-maps <img src="https://raw.githubusercontent.com/souljorje/d3-maps/refs/heads/main/packages/docs/public/d3-maps-logo.svg" alt ="d3-maps logo" width="20" height="20"> [![CI](https://github.com/souljorje/d3-maps/actions/workflows/ci.yml/badge.svg)](https://github.com/souljorje/d3-maps/actions/workflows/ci.yml) [![Netlify Status](https://api.netlify.com/api/v1/badges/619b15fb-c666-48ed-9715-894474c88e35/deploy-status)](https://d3-maps.netlify.app) [![@d3-maps/vue bundle size](https://img.shields.io/bundlephobia/minzip/%40d3-maps%2Fvue?color=%2342b883&label=%40d3-maps%2Fvue)](https://www.npmjs.com/package/@d3-maps/vue) [![@d3-maps/react bundle size](https://img.shields.io/bundlephobia/minzip/%40d3-maps%2Freact?color=%2358c4dc&label=%40d3-maps%2Freact)](https://www.npmjs.com/package/@d3-maps/react)

Interactive SVG maps for React 19 and Vue 3.  

Build choropleths, markers, routes, bubble and zoomable maps with components powered by D3.

<sub>Solid and Svelte support coming soon.</sub>

[**Docs**](https://d3-maps.netlify.app/guide) · [**Examples**](https://d3-maps.netlify.app/examples) · [**Migrate from react-simple-maps**](https://d3-maps.netlify.app/guide/migration-from-react-simple-maps)

## Features

✨ Drop-in components, powerful defaults  
🧩 Zoom, drag, lines, markers, and more  
⚛️ Reactive rendering  
📱 Responsive by default  
🪶 Lightweight and tree-shakable  
🧑‍💻 Fully typed  
🗄️ SSR friendly  
📑 TopoJSON and GeoJSON support  
🌐 Ready-to-use geo files

## Get started

### Vue

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

```vue
<script setup lang="ts">
import { MapBase, MapFeatures, type MapData } from '@d3-maps/vue'

const { default: data } = await import('@d3-maps/atlas/world/countries/countries-110m')
const mapData: MapData = data
</script>

<template>
  <MapBase>
    <MapFeatures :data="mapData" />
  </MapBase>
</template>
```

### React

```bash
npm install @d3-maps/react
```

<details>
  <summary>pnpm, bun, CDN</summary>
  
  ```bash
  pnpm add @d3-maps/react
  ```

  ```bash
  bun add @d3-maps/react
  ```

  ```html
  <script type="module">
    import { MapBase, MapFeatures } from 'https://esm.sh/@d3-maps/react'
    import 'https://esm.sh/@d3-maps/react/style.css'
  </script>
  ```
</details>

```tsx
import '@d3-maps/react/style.css'
import { MapBase, MapFeatures, type MapData } from '@d3-maps/react'
import { use } from 'react'

export function MapView() {
  const data = use(import('@d3-maps/atlas/world/countries/countries-110m').then(({ default: world }) => world as MapData))

  return (
    <MapBase>
      <MapFeatures data={data} />
    </MapBase>
  )
}
```

## When to use

| Case | Support | Notes |
|---|:---:|---|
| Interactive SVG maps | ✅ | Choropleth, bubble, heatmap, etc |
| Components API | ✅ | React & Vue packages |
| GeoJSON/TopoJSON rendering | ✅ | Geographic data to SVG |
| Markers, lines, annotations | ✅ | Framework-native components |
| Zoomable maps | ✅ | Mobile & desktop zoom and pan |
| Low-level map rendering | ⚠️ | Use D3.js for full control |
| Full chart workflow | ❌ | Use amCharts, Highcharts or Plot |
| Real-world map apps | ❌ | Use Leaflet or MapLibre |
| Data-heavy 3D maps | ❌ | Use MapLibre |

## Development

```bash
pnpm install
pnpm build
pnpm build:docs
pnpm dev
```

## Contributing

See the [Contributing Guide](CONTRIBUTING.md)

## Inspired by

[react-simple-maps](https://github.com/zcreativelabs/react-simple-maps)  
[Observable Plot](https://observablehq.com/plot/)

## License

MIT licensed. Copyright © 2026 Georgii Bukharov. See [LICENCE](./LICENCE) for more details.
