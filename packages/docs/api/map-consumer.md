# MapConsumer

Consumes map context

## Slots

### Default

``` js
{
  projection: mapProjection,
  width: String,
  height: String,
  features: GeoJSON[],
  path: Function ([docs](https://github.com/d3/d3-geo#_path)),
}
```

## Usage

[MapFeature](https://github.com/souljorje/-maps/vue/blob/main/src/components/MapFeature.vue) source code.

``` html
<template>
  <MapConsumer #default="{ path }">
    <path
      :d="path(data)"
      :style="computedStyle"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
      @mousedown="onMouseDown"
      @mouseup="onMouseUp"
      @click="onMouseUp"
    />
  </MapConsumer>
</template>

<script>
import { MapConsumer } from './MapContext';
import MapItem from '../mixins/MapItem';

export default {
  name: 'MapFeature',
  components: {
    MapConsumer,
  },
  mixins: [MapItem],
  props: {
    data: {
      type: Object,
      default: undefined,
    },
  },
};
</script>
```
