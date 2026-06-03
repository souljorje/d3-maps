# @d3-maps/atlas

Ready-to-use TopoJSON maps: world, continents, countries and more

[**Docs**](https://d3-maps.netlify.app/guide) · [**Examples**](https://d3-maps.netlify.app/examples)

## Features

🗺️ Ready-to-use world layers, country, and continent maps  
🌍 Built from Natural Earth data  
🧑‍💻 Fully typed  
🪶 Tree-shakable exports  
⚛️ Works with React and Vue

## Install

```bash
npm install @d3-maps/atlas
```

<details>
  <summary>pnpm, bun, CDN</summary>
  
  ```bash
  pnpm add @d3-maps/atlas
  ```

  ```bash
  bun add @d3-maps/atlas
  ```

  ```html
  <script type="module">
    import Countries from 'https://esm.sh/@d3-maps/atlas/world/countries'
  </script>
  ```
</details>

## Usage

### World countries

```tsx
import { MapBase, MapFeatures } from '@d3-maps/react'
import Countries from '@d3-maps/atlas/world/countries'

export function App() {
  return (
    <MapBase>
      <MapFeatures data={Countries} />
    </MapBase>
  )
}
```

### World layers

```tsx
import { MapBase, MapFeatures } from '@d3-maps/react'
import Ocean from '@d3-maps/atlas/world/ocean'
import Coastline from '@d3-maps/atlas/world/coastline'

export function App() {
  return (
    <MapBase>
      <MapFeatures data={Ocean} />
      <MapFeatures data={Coastline} />
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
    <MapBase>
      <MapFeatures data={Georgia} />
      <MapFeatures data={Germany} />
      <MapFeatures data={Russia} />
    </MapBase>
  )
}
```

## Scales

| Scale | Use it for |
| --- | --- |
| `110m` | World maps, dashboards, examples, and the smallest payload |
| `50m` | Regional maps or closer zoom where `110m` looks too coarse |
| `10m` | Country detail views where coastline and border detail matter |

Default country imports use the coarsest available scale. In most cases that is `110m`, if not then `50m`, then `10m`.

```ts
import Japan from '@d3-maps/atlas/countries/japan' // japan-110m
import Japan10m from '@d3-maps/atlas/countries/japan/japan-10m'
import Japan50m from '@d3-maps/atlas/countries/japan/japan-50m'
import Japan110m from '@d3-maps/atlas/countries/japan/japan-110m'
```

## Data

Country, continent, and world-countries properties are normalized and typed:

```ts
type AtlasProperties = {
  id: string // adm0A3
  name: string
  name_long?: string
}
```

Use metadata when you need richer country or continent information:

```ts
import continents from '@d3-maps/atlas/metadata/continents'
import countries from '@d3-maps/atlas/metadata/countries'
```

## Data source

Generated from [Natural Earth](https://www.naturalearthdata.com/).

Natural Earth data is public domain.

## License

MIT licensed. Copyright © 2026 Georgii Bukharov. See [LICENCE](../../LICENCE) for more details.
