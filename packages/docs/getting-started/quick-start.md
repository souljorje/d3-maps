# Quick Start

## Installation

<!--@include: @/.vitepress/parts/installation.md-->

::: details [Optional] Framework setup snippets

::: code-group

```ts [vue]
import { createApp } from 'vue'
import { plugin as D3MapsVue } from '@d3-maps/vue'
import App from './App.vue'

createApp(App)
  .use(D3MapsVue)
  .mount('#app')
```

```ts [nuxt]
// ~/plugins/d3-maps.client.ts
import { plugin as D3MapsVue } from '@d3-maps/vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(D3MapsVue)
})
```

```tsx [react]
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

::: code-group

<<< ../.vitepress/examples/basic.vue[vue]
<<< ../.vitepress/examples/react/basic.tsx[react]

:::

### Result

<Demo component-name="basic"/>

## Next

- Learn about [components](/components/)
- See more [examples](/examples/)
