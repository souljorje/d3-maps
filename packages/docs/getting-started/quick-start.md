# Quick Start

## Installation

<!--@include: @/.vitepress/parts/installation.md-->

::: details [Optional] Plugin to register components globally

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

:::

## Render your first map

1) Use [Map](/components/map) and [MapFeatures](/components/map-features) components
2) Provide the [data](./data) (TopoJSON or GeoJSON)
3) Done

::: code-group

<<< ../.vitepress/examples/basic.vue[vue]

:::

### Result

<Demo component-name="basic"/>

## Next

- Learn about [components](/components/)
- See more [examples](/examples/)
