---
description: TopoJSON world, continent, and country maps usage
---

# Atlas

`@d3-maps/atlas` gives you ready-to-use TopoJSON for world, continent, and country maps

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

Default country imports use the coarsest available scale. In most cases that is `110m`.

```ts
import Japan from '@d3-maps/atlas/countries/japan' // japan-110m
import Japan10m from '@d3-maps/atlas/countries/japan/japan-10m'
import Japan50m from '@d3-maps/atlas/countries/japan/japan-50m'
import Countries110m from '@d3-maps/atlas/world/countries/countries-110m'
```

| Scale | Use it for |
| --- | --- |
| `110m` | World maps, dashboards, examples, and the smallest payload |
| `50m` | Regional maps or closer zoom where `110m` looks too coarse |
| `10m` | Country detail views where coastline and border detail matter |

## Data properties

Atlas TopoJSON feature properties are intentionally minimal

```ts
type AtlasProperties = {
  id: string // adm0A3
  name: string
  name_long?: string
}
```

Use Atlas metadata when you need richer country or continent information

```ts
import countries from '@d3-maps/atlas/metadata/countries'
import continents from '@d3-maps/atlas/metadata/continents'
```

```ts
type CountryMetadata = {
  slug: string
  exportName: string
  name: string
  adm0A3: string
  isoA2?: string
  isoA3?: string
  continent?: string
  region?: string
  subregion?: string
  popEst?: number
  gdpMd?: number
  scales: Array<'110m' | '50m' | '10m'>
  defaultScale: '110m' | '50m' | '10m'
}
```

## Import matrix

| Entity | Default import | Scale-specific import pattern |
| --- | --- | --- |
| World countries | `@d3-maps/atlas/world/countries` | `@d3-maps/atlas/world/countries/countries-<scale>` |
| One continent | `@d3-maps/atlas/continents/<slug>` | Continent default entry only |
| One country | `@d3-maps/atlas/countries/<slug>` | `@d3-maps/atlas/countries/<slug>/<slug>-<scale>` |

## Keep bundle size down

Choose the narrowest import that matches the map you render

- Use `@d3-maps/atlas/countries/japan` instead of `@d3-maps/atlas/countries` for one country
- Use `@d3-maps/atlas/world/countries` before higher-scale world variants
- Use `50m` before `10m` when you need more detail
- Avoid loading world data and many country datasets together unless the UI needs both

## Data source

Generated from [Natural Earth](https://www.naturalearthdata.com/)
