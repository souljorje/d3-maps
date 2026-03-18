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
import { Map, MapFeatures } from '@d3-maps/react'

export function App({ mapData }: { mapData: unknown }) {
  return (
    <Map data={mapData}>
      <MapFeatures />
    </Map>
  )
}
```

## Styling

Importing `@d3-maps/react` automatically includes `@d3-maps/core/index.css`

If you need strict stylesheet ordering, load your global reset/theme styles before importing the adapter entry

## License

MIT licensed. Copyright © 2020 Georgii Bukharov. See [LICENSE](./LICENSE) for more details.
