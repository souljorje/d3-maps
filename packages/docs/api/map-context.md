# MapContext

Provides reactive context for map children

## Usage

``` js
import { MapContext } from './MapContext'

export default {
  inject: {
    mapContext: MapContext,
  },
  computed: {
    context() {
      return this.mapContext()
    },
    mapWidth() {
      return this.context.width
    },
  },
}
```
