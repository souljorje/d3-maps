# @d3-maps/react

`@d3-maps/react` provides React bindings for `@d3-maps/core` to build SVG maps with React, [d3](https://github.com/d3/d3) and [TopoJSON-client](https://github.com/TopoJSON/TopoJSON-client).

[docs](https://souljorje.github.io/d3-maps)

## Installation

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

## License

MIT licensed. Copyright © 2020 Georgii Bukharov. See [LICENSE](./LICENSE) for more details.
