# @d3-maps/react <img src="https://raw.githubusercontent.com/souljorje/d3-maps/refs/heads/main/packages/docs/public/d3-maps-logo.svg" alt ="d3-maps logo" width="20" height="20"> [![CI](https://github.com/souljorje/d3-maps/actions/workflows/ci.yml/badge.svg)](https://github.com/souljorje/d3-maps/actions/workflows/ci.yml) [![Netlify Status](https://api.netlify.com/api/v1/badges/619b15fb-c666-48ed-9715-894474c88e35/deploy-status)](https://d3-maps.netlify.app) [![@d3-maps/react bundle size](https://img.shields.io/bundlephobia/minzip/@d3-maps/react?color=%2358c4dc)](https://bundlephobia.com/package/@d3-maps/react)

Interactive SVG maps for React, powered D3.  

[**Docs**](https://d3-maps.netlify.app/guide) · [**Examples**](https://d3-maps.netlify.app/examples) · [**Migrate from react-simple-maps**](https://d3-maps.netlify.app/guide/migration-from-react-simple-maps)

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

## Usage

```tsx
import '@d3-maps/react/style.css'
import { MapBase, MapFeatures, type MapData } from '@d3-maps/react'

export function App({ mapData }: { mapData: MapData }) {
  return (
    <MapBase>
      <MapFeatures data={mapData} />
    </MapBase>
  )
}
```

## License

MIT licensed. Copyright © 2026 Georgii Bukharov. See [LICENCE](./LICENCE) for more details.
