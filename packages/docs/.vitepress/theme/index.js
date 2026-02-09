import { plugin as D3Maps } from '@d3-maps/vue'
import DefaultTheme from 'vitepress/theme'
import Demo from './components/Demo.vue'
import ExampleBubble from './components/examples/bubble-map.vue'
import ExampleChoroplet from './components/examples/choroplet-map.vue'
import ExampleMarkers from './components/examples/markers.vue'
import ExampleSimple from './components/examples/simple.vue'
import ExampleZoomAndDrag from './components/examples/zoom-and-drag.vue'
import './custom.css'

const exampleComponents = {
  'examples-simple': ExampleSimple,
  'examples-markers': ExampleMarkers,
  'examples-zoom-and-drag': ExampleZoomAndDrag,
  'examples-choroplet-map': ExampleChoroplet,
  'examples-bubble-map': ExampleBubble,
}

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    DefaultTheme.enhanceApp({ app })
    app.use(D3Maps)
    app.component('Demo', Demo)
    Object.entries(exampleComponents).forEach(([name, component]) => {
      app.component(name, component)
    })
  },
}
