# Quick Start

## Installation

<!--@include: @/.vitepress/parts/installation.md-->

::: details [Optional] Framework setup snippets

:::tabs key:framework

== Vue

::: code-group

```ts
import { createApp } from 'vue'
import { plugin as D3MapsVue } from '@d3-maps/vue'
import App from './App.vue'

createApp(App)
  .use(D3MapsVue)
  .mount('#app')
```

```ts [Nuxt]
// ~/plugins/d3-maps.client.ts
import { plugin as D3MapsVue } from '@d3-maps/vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(D3MapsVue)
})
```

:::

== React

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

:::

## Render your first map

1) Use [Map](/components/map) and [MapFeatures](/components/map-features) components
2) Provide the [data](./data) (TopoJSON or GeoJSON)
3) Done

:::tabs key:framework

== Vue

<<< ../.vitepress/examples/basic.vue

== React

<<< ../.vitepress/examples/react/basic.tsx

:::

### Result

<Demo component-name="basic"/>

## Next

- Learn about [components](/components/)
- See more [examples](/examples/)
