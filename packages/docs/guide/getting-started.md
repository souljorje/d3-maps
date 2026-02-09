# Getting started

## Installation

<!--@include: @/.vitepress/parts/installation.md-->

## Usage

### 1. Install vue plugin

``` js
import { createApp } from 'vue'
import D3MapsVue from '@d3-maps/vue'
import App from './App.vue'

const app = createApp(App)
app.use(VueSimpleMaps)
app.mount('#app')
```

**Nuxt 3** \
Create `~/plugins/d3-maps-vue.client.ts`

``` js
import D3MapsVue from '@d3-maps/vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueSimpleMaps)
})
```

### 2. Create component

You can use any TopoJSON/GeoJSON and projection. Find TopoJSON files in [this repo](https://github.com/deldersveld/TopoJSON).

<SourceCode>
  <<< @/.vitepress/theme/components/examples/simple.vue
</SourceCode>

Viola

<Demo componentName="examples-simple" />

See more [examples](/examples/) or learn [API](/api/)
