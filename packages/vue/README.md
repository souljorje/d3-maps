# @d3-maps/vue

`@d3-maps/vue` provides Vue bindings for `@d3-maps/core` to build SVG maps with Vue, [d3](https://github.com/d3/d3) and [TopoJSON-client](https://github.com/TopoJSON/TopoJSON-client).

[docs](https://d3-maps.netlify.app/guide/) | [examples](https://d3-maps.netlify.app/examples/) _(being updated for the new package name)_

## Installation

npm

```bash
npm install @d3-maps/vue
```

yarn

```bash
yarn add @d3-maps/vue
```

## Usage

```js
import { createApp } from 'vue'
import D3MapsVue from '@d3-maps/vue'
import App from './App.vue'

const app = createApp(App)
app.use(D3MapsVue)
app.mount('#app')
```

_Nuxt 3_ \
Create `~/plugins/d3-maps-vue.client.ts`:

```ts
import D3MapsVue from '@d3-maps/vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(D3MapsVue)
})
```

## License

MIT licensed. Copyright © 2020 Georgii Bukharov. See [LICENSE](./LICENSE) for more details.
