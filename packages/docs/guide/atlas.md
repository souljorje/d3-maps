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
  <MapBase :fit="Countries">
    <MapFeatures :data="Countries" />
  </MapBase>
</template>
```

== React

```tsx [react]
import { MapBase, MapFeatures } from '@d3-maps/react'
import Countries from '@d3-maps/atlas/world/countries'

export function App() {
  return (
    <MapBase fit={Countries}>
      <MapFeatures data={Countries} />
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
  <MapBase>
    <MapFeatures :data="Land" />
    <MapFeatures :data="Coastline" />
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
    <MapBase>
      <MapFeatures data={Land} />
      <MapFeatures data={Coastline} />
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
  <MapBase :fit="Africa">
    <MapFeatures :data="Africa" />
  </MapBase>
</template>
```

== React

```tsx [react]
import { MapBase, MapFeatures } from '@d3-maps/react'
import Africa from '@d3-maps/atlas/continents/africa'

export function App() {
  return (
    <MapBase fit={Africa}>
      <MapFeatures data={Africa} />
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
  <MapBase :fit="Japan">
    <MapFeatures :data="Japan" />
  </MapBase>
</template>
```

== React

```tsx [react]
import { MapBase, MapFeatures } from '@d3-maps/react'
import Japan from '@d3-maps/atlas/countries/japan'

export function App() {
  return (
    <MapBase fit={Japan}>
      <MapFeatures data={Japan} />
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
  <MapBase>
    <MapFeatures :data="Georgia" />
    <MapFeatures :data="Germany" />
    <MapFeatures :data="Russia" />
  </MapBase>
</template>
```

== React

```tsx [react]
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

:::

## Scales

| Scale | Use it for |
| --- | --- |
| `110m` | World maps, dashboards, examples, and the smallest payload |
| `50m` | Regional maps or closer zoom where `110m` looks too coarse |
| `10m` | Country detail views where coastline and border detail matter |

Default country imports use the coarsest available scale. In most cases that is `110m`

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

Use metadata when you need richer country or continent information

```ts
import countries from '@d3-maps/atlas/metadata/countries'
import continents from '@d3-maps/atlas/metadata/continents'
```

## Data types

Types can be imported from `@d3-maps/atlas/types`  
Country, continent, and world-countries properties are by default typed as `AtlasFeatureProperties`
