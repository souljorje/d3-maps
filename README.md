# d3-maps <img src="https://raw.githubusercontent.com/souljorje/d3-maps/refs/heads/main/packages/docs/public/d3-maps-logo.svg" alt ="d3-maps logo" width="20" height="20"> [![CI](https://github.com/souljorje/d3-maps/actions/workflows/ci.yml/badge.svg)](https://github.com/souljorje/d3-maps/actions/workflows/ci.yml) [![Netlify Status](https://api.netlify.com/api/v1/badges/619b15fb-c666-48ed-9715-894474c88e35/deploy-status)](https://d3-maps.netlify.app)

Interactive SVG maps for React and Vue powered by D3.  
Solid and Svelte support coming soon.

<!-- ![@d3-maps/vue](https://img.shields.io/bundlephobia/minzip/%40d3-maps/vue) -->

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

## Get started

### Vue

NPM

```bash
npm install @d3-maps/vue
```

CDN

```html
<script type="module">
  import { MapBase, MapFeatures } from 'https://esm.sh/@d3-maps/vue'
  import 'https://esm.sh/@d3-maps/vue/style.css'
</script>
```

```vue
<script setup lang="ts">
import { MapBase, MapFeatures, type MapData } from '@d3-maps/vue'

const { default: data } = await import('world-atlas/countries-110m.json')
const mapData: MapData = data
</script>

<template>
  <MapBase :data="mapData">
    <MapFeatures />
  </MapBase>
</template>
```

### React

NPM

```bash
npm install @d3-maps/react
```

CDN

```html
<script type="module">
  import { MapBase, MapFeatures } from 'https://esm.sh/@d3-maps/react'
  import 'https://esm.sh/@d3-maps/react/style.css'
</script>
```

```tsx
import { useEffect, useState } from 'react'
import '@d3-maps/react/style.css'
import { MapBase, MapFeatures, type MapData } from '@d3-maps/react'

export function MapView() {
  const [data, setData] = useState<MapData | null>(null)

  useEffect(() => {
    import('world-atlas/countries-110m.json').then(({ default: world }) => {
      setData(world as MapData)
    })
  }, [])

  if (!data) return null

  return (
    <MapBase data={data}>
      <MapFeatures />
    </MapBase>
  )
}
```

## Development

```bash
pnpm install
pnpm build
pnpm build:docs
pnpm dev
```

## Contributing

See the [Contributing Guide](CONTRIBUTING.md)

## License

MIT licensed. Copyright © 2026 Georgii Bukharov. See [LICENCE](./LICENCE) for more details.

## Inspired by

[react-simple-maps](https://github.com/zcreativelabs/react-simple-maps)
