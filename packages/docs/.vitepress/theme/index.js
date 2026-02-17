import { plugin as D3Maps } from '@d3-maps/vue'
import DefaultTheme from 'vitepress/theme'
import Demo from './components/Demo.vue'
import ExamplesList from './components/ExamplesList.vue'

import './custom.css'

const demoModules = import.meta.glob('../examples/*.vue', {
  eager: true,
  import: 'default',
})

function toPascalCase(value) {
  return value.replace(/(^\w|[-_]\w)/g, (match) => match.replace(/[-_]/, '').toUpperCase())
}

function registerDemoComponents(app) {
  for (const [filePath, component] of Object.entries(demoModules)) {
    const match = /\/([^/]+)\.vue$/.exec(filePath)
    if (!match) continue

    const slug = match[1]
    const componentName = `${toPascalCase(slug)}`
    app.component(componentName, component)
  }
}

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    DefaultTheme.enhanceApp({ app })
    app.use(D3Maps)
    registerDemoComponents(app)
    app.component('Demo', Demo)
    app.component('ExamplesList', ExamplesList)
  },
}
