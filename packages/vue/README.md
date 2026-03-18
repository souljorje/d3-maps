# @d3-maps/vue

Reactive SVG maps, powered by D3.  

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

## Styling

Importing `@d3-maps/vue` automatically includes `@d3-maps/core/index.css`

If you need strict stylesheet ordering, load your global reset/theme styles before importing the adapter entry

## License

MIT licensed. Copyright © 2020 Georgii Bukharov. See [LICENSE](./LICENSE) for more details.
