# @d3-maps/react

Reactive SVG maps, powered by D3.  

[docs](https://souljorje.github.io/d3-maps)  
[Migrate from react-simple-maps](https://souljorje.github.io/d3-maps/guide/migration-from-react-simple-maps.html)

## Installation

Requires React 19+

Next.js App Router: `@d3-maps/react` entrypoints are client-only (`'use client'`), so import them from Client Components  
React Server Components entrypoints are planned

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
import '@d3-maps/react/index.css'
import { MapBase, MapFeatures } from '@d3-maps/react'

export function App({ mapData }: { mapData: unknown }) {
  return (
    <MapBase data={mapData}>
      <MapFeatures />
    </MapBase>
  )
}
```

## Styling

Import the stylesheet explicitly from `@d3-maps/react/index.css`

This keeps the package entry side-effect-free and lets you control stylesheet order directly

## License

MIT licensed. Copyright © 2020 Georgii Bukharov. See [LICENSE](./LICENSE) for more details.
