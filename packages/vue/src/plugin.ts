import type { App, Component } from 'vue'
import * as components from './components'

export const plugin = {
  install(app: App) {
    Object.entries<Component>(components).forEach(([name, component]) => {
      app.component(name, component)
    })
  },
}

// TODO: make CDN version
// if (typeof window !== 'undefined' && window.Vue) {
//   window.Vue.use(plugin)
// }
