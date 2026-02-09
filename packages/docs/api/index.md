# Map

## Props

### ```width```

Type: `Number`\
Default: 800

### ```height```

Type: `Number`\
Default: 600

### ```projection```

Type: `Function`\
Default: `undefined`\
Description: Projection from [d3-geo](https://github.com/d3/d3-geo) or [d3-geo-projection](https://github.com/d3/d3-geo-projection) or any other custom projection.

### ```projectionConfig```

Type: `Object`\
Default: `undefined`\
Description: Configuration for projection, see [d3-geo docs](https://github.com/d3/d3-geo#projections). It's object where key is a method and value is an argument.

``` js
projectionConfig: {
  center: [[0, 50]]
  rotate: [[0, 0, 0]]
  translate: [[100, 200]]
},
```

::: warning
Value must allways be an array to apply it correctly as an argument
:::

::: tip
By default [fitSize](https://github.com/d3/d3-geo#projection_fitSize) method used to align map.
:::

### ```data```

Type: `[Object, Array]`\
Default: `undefined`\
Description: TopoJSON or GeoJSON object. TopoJSON will be automatically transformed to GeoJSON via [TopoJSON-client](https://github.com/TopoJSON/TopoJSON-client)

::: tip
Use TopoJSON and fetch it on client side. You don't need huge json in your bundle and map on server side. See [difference between GeoJSON and TopoJSON](https://stackoverflow.com/questions/14740705/difference-between-GeoJSON-and-TopoJSON).
:::

### ```dataTransformer```

Type: `Function`\
Default: `undefined`\
Description: Function to transform GeoJSON.

``` ts
(GeoJSON: array) => array
```

::: tip
See usage in [example with markers](/examples/markers)
:::

## Slots

### default

Default slot, used to render items.

## Events

Emits all native `<svg>` element events.
