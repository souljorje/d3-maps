# @d3-maps/atlas

Ready-to-use TopoJSON maps: world, continents, countries

[**Docs**](https://d3-maps.netlify.app/guide) · [**Examples**](https://d3-maps.netlify.app/examples)

## Features

🗺️ Ready-to-use world, country, and continent maps  
🌍 Built from Natural Earth data  
📦 TopoJSON by default  
🧑‍💻 Fully typed  
🪶 Tree-shakable exports  
⚛️ Works with `@d3-maps/react`  
🟢 Works with `@d3-maps/vue`

## Installation

```bash
npm install @d3-maps/atlas
````

```bash
pnpm add @d3-maps/atlas
```

```bash
bun add @d3-maps/atlas
```

## Usage

### World countries

```tsx
import { MapBase, MapFeatures } from '@d3-maps/react'
import Countries from '@d3-maps/atlas/world/countries'

export function App() {
  return (
    <MapBase data={Countries}>
      <MapFeatures />
    </MapBase>
  )
}
```

### Individual countries

```tsx
import { MapBase, MapFeatures } from '@d3-maps/react'
import { Georgia, Germany, Russia } from '@d3-maps/atlas/countries'

export function App() {
  return (
    <MapBase data={[Georgia, Germany, Russia]}>
      <MapFeatures />
    </MapBase>
  )
}
```

### Specific scale

```ts
import Russia110m from '@d3-maps/atlas/countries/russia/110m'
import Russia50m from '@d3-maps/atlas/countries/russia/50m'
import Russia10m from '@d3-maps/atlas/countries/russia/10m'
```

## Scales

Atlas files are available in Natural Earth scales:

| Scale  | Use case                                               |
| ------ | ------------------------------------------------------ |
| `110m` | Default. Fast, small, good for examples and dashboards |
| `50m`  | More detail, still suitable for web apps               |
| `10m`  | Highest detail, larger files                           |

Default imports use `110m`:

```ts
import Russia from '@d3-maps/atlas/countries/russia'
```

Same as:

```ts
import Russia from '@d3-maps/atlas/countries/russia/110m'
```

## Data source

Generated from [Natural Earth](https://www.naturalearthdata.com/).

Natural Earth data is public domain. Generated files preserve source metadata.

## License

MIT licensed. Copyright © 2026 Georgii Bukharov. See [LICENCE](../../LICENCE) for more details.
