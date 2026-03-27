# @d3-maps/react

Reactive SVG maps, powered by D3  

[**Docs**](https://d3-maps.netlify.app/guide) · [**Examples**](https://d3-maps.netlify.app/examples) · [**Migrate from react-simple-maps**](https://d3-maps.netlify.app/guide/migration-from-react-simple-maps.html)



## Features

- Drop-in components, powerful defaults
- Zoom, drag, lines, markers, and more
- Reactive rerender
- Responsive by default
- Lightweight and tree-shakable
- SSR friendly
- Supports TopoJSON and GeoJSON

## Installation

Requires React 19+

npm

```bash
npm install @d3-maps/react
```

pnpm

```bash
pnpm add @d3-maps/react
```

bun

```bash
bun add @d3-maps/react
```

## Usage

```tsx
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

MIT licensed. Copyright © 2020 Georgii Bukharov. See [LICENSE](./LICENSE) for more details.
