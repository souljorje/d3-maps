# @d3-maps/vue

`@d3-maps/vue` provides Vue bindings for `@d3-maps/core` to build SVG maps with Vue, [d3](https://github.com/d3/d3) and [TopoJSON-client](https://github.com/TopoJSON/TopoJSON-client).

[docs](https://souljorje.github.io/d3-maps)

## Installation

npm

```bash
npm install @d3-maps/vue
```

pnpm

```bash
pnpm add @d3-maps/vue
```

bun

```bash
bun add @d3-maps/vue
```

## Usage

```js
import { createApp } from 'vue'
import { plugin as D3MapsVue } from '@d3-maps/vue'
import App from './App.vue'

createApp(App)
  .use(D3MapsVue)
  .mount('#app')
```

_Nuxt 3_ \
Create `~/plugins/d3-maps-vue.client.ts`:

```ts
import { plugin as D3MapsVue } from '@d3-maps/vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(D3MapsVue)
})
```

## License

MIT licensed. Copyright © 2020 Georgii Bukharov. See [LICENSE](./LICENSE) for more details.
