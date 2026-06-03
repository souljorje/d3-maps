# @d3-maps/react [![@d3-maps/react bundle size](https://deno.bundlejs.com/badge?q=@d3-maps/react@0.7.0&config={%22esbuild%22:{%22external%22:[%22react%22,%22react-dom%22]}})](https://deno.bundlejs.com/badge?q=@d3-maps/react@0.7.0&config={%22esbuild%22:{%22external%22:[%22react%22,%22react-dom%22]}})

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

MIT licensed. Copyright © 2026 Georgii Bukharov. See [LICENCE](../../LICENCE) for more details.
