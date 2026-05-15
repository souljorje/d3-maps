---
description: TopoJSON world layers, continent, and country maps usage
---

# Atlas

`@d3-maps/atlas` is a TopoJSON collection of world layers, continent, and country maps

## Install

:::tabs key:package-manager

== npm

```bash
npm install @d3-maps/atlas
```

== pnpm

```bash
pnpm add @d3-maps/atlas
```

== bun

```bash
bun add @d3-maps/atlas
```

:::

## Usage

### World map

:::tabs key:framework

== Vue

```vue [vue]
<script setup lang="ts">
import { MapBase, MapFeatures } from '@d3-maps/vue'
import Countries from '@d3-maps/atlas/world/countries'
</script>

<template>
  <MapBase :data="Countries">
    <MapFeatures />
  </MapBase>
</template>
```

== React

```tsx [react]
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

:::

### World layers

:::tabs key:framework

== Vue

```vue [vue]
<script setup lang="ts">
import { MapBase, MapFeatures } from '@d3-maps/vue'
import Land from '@d3-maps/atlas/world/land'
import Coastline from '@d3-maps/atlas/world/coastline'
</script>

<template>
  <MapBase :data="[Land, Coastline]">
    <MapFeatures />
  </MapBase>
</template>
```

== React

```tsx [react]
import { MapBase, MapFeatures } from '@d3-maps/react'
import Land from '@d3-maps/atlas/world/land'
import Coastline from '@d3-maps/atlas/world/coastline'

export function App() {
  return (
    <MapBase data={[Land, Coastline]}>
      <MapFeatures />
    </MapBase>
  )
}
```

:::

### Continent

:::tabs key:framework

== Vue

```vue [vue]
<script setup lang="ts">
import { MapBase, MapFeatures } from '@d3-maps/vue'
import Africa from '@d3-maps/atlas/continents/africa'
</script>

<template>
  <MapBase :data="Africa">
    <MapFeatures />
  </MapBase>
</template>
```

== React

```tsx [react]
import { MapBase, MapFeatures } from '@d3-maps/react'
import Africa from '@d3-maps/atlas/continents/africa'

export function App() {
  return (
    <MapBase data={Africa}>
      <MapFeatures />
    </MapBase>
  )
}
```

:::

### Country

:::tabs key:framework

== Vue

```vue [vue]
<script setup lang="ts">
import { MapBase, MapFeatures } from '@d3-maps/vue'
import Japan from '@d3-maps/atlas/countries/japan'
</script>

<template>
  <MapBase :data="Japan">
    <MapFeatures />
  </MapBase>
</template>
```

== React

```tsx [react]
import { MapBase, MapFeatures } from '@d3-maps/react'
import Japan from '@d3-maps/atlas/countries/japan'

export function App() {
  return (
    <MapBase data={Japan}>
      <MapFeatures />
    </MapBase>
  )
}
```

:::

### Multiple countries

:::tabs key:framework

== Vue

```vue [vue]
<script setup lang="ts">
import { MapBase, MapFeatures } from '@d3-maps/vue'
import { Georgia, Germany, Russia } from '@d3-maps/atlas/countries'
</script>

<template>
  <MapBase :data="[Georgia, Germany, Russia]">
    <MapFeatures />
  </MapBase>
</template>
```

== React

```tsx [react]
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

:::

## Scales

| Scale | Use it for |
| --- | --- |
| `110m` | World maps, dashboards, examples, and the smallest payload |
| `50m` | Regional maps or closer zoom where `110m` looks too coarse |
| `10m` | Country detail views where coastline and border detail matter |

Default country imports use the coarsest available scale. In most cases that is `110m`.

```ts
import Japan from '@d3-maps/atlas/countries/japan' // japan-110m
import Japan10m from '@d3-maps/atlas/countries/japan/japan-10m'
import Japan50m from '@d3-maps/atlas/countries/japan/japan-50m'
import Japan110m from '@d3-maps/atlas/countries/japan/japan-110m'
```

## Import matrix

| Entity | Default import | Scale-specific import pattern |
| --- | --- | --- |
| Country | `@d3-maps/atlas/countries/<slug>` | `@d3-maps/atlas/countries/<slug>/<slug>-<scale>` |
| Continent | `@d3-maps/atlas/continents/<slug>` | Continent default entry only |
| World countries | `@d3-maps/atlas/world/countries` | `@d3-maps/atlas/world/countries/countries-<scale>` |
| World land | `@d3-maps/atlas/world/land` | `@d3-maps/atlas/world/land/land-<scale>` |
| World ocean | `@d3-maps/atlas/world/ocean` | `@d3-maps/atlas/world/ocean/ocean-<scale>` |
| World coastline | `@d3-maps/atlas/world/coastline` | `@d3-maps/atlas/world/coastline/coastline-<scale>` |
| World lakes | `@d3-maps/atlas/world/lakes` | `@d3-maps/atlas/world/lakes/lakes-<scale>` |
| World rivers | `@d3-maps/atlas/world/rivers` | `@d3-maps/atlas/world/rivers/rivers-<scale>` |

## Metadata

Use metadata when you need richer country or continent information.

```ts
import countries from '@d3-maps/atlas/metadata/countries'
import continents from '@d3-maps/atlas/metadata/continents'
```

## Data types

Types can be imported from `@d3-maps/atlas/types`.
Country, continent, and world-countries properties are by default typed as `AtlasFeatureProperties`

<<< @/../atlas/src/types.ts#types

## Keep bundle size down

Choose the narrowest import that matches the map you render

- Use `@d3-maps/atlas/countries/japan` instead of `@d3-maps/atlas/countries` for one country
- Use `@d3-maps/atlas/world/countries` before higher-scale world variants
- Use `50m` before `10m` when you need more detail
- Avoid loading world data and many country datasets together unless the UI needs both

## Source

Generated from [Natural Earth](https://www.naturalearthdata.com/)
