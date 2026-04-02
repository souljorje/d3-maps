# @d3-maps/react [![@d3-maps/react bundle size](https://deno.bundlejs.com/badge?q=@d3-maps/react@0.7.0&config={%22esbuild%22:{%22external%22:[%22react%22,%22react-dom%22]}})](https://deno.bundlejs.com/badge?q=@d3-maps/react@0.7.0&config={%22esbuild%22:{%22external%22:[%22react%22,%22react-dom%22]}})

Interactive SVG maps with React and D3.  

[**Docs**](https://d3-maps.netlify.app/guide) · [**Examples**](https://d3-maps.netlify.app/examples) · [**Migrate from react-simple-maps**](https://d3-maps.netlify.app/guide/migration-from-react-simple-maps.html)

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
npm install @d3-maps/react
```

```bash
pnpm add @d3-maps/react
```

```bash
bun add @d3-maps/react
```

## Usage

```tsx
import '@d3-maps/react/style.css'
import { MapBase, MapFeatures } from '@d3-maps/react'

export function App({ mapData }: { mapData: unknown }) {
  return (
    <MapBase data={mapData}>
      <MapFeatures />
    </MapBase>
  )
}
```

## License

MIT licensed. Copyright © 2026 Georgii Bukharov. See [LICENCE](../../LICENCE) for more details.
