# MapFeature

Renders GeoJSON feature.

## Props

### ```styles```

Type: `Object`\
Default: `{}`\
Description: Object where key is a state and value is CSS (string, object, array).

``` js
styles: {
  default: 'fill: #000',
  hover: {
    fill:  #000,
    opacity: 0.8
  },
  pressed: 'fill: #ccc',
},
```

### ```data```

Type: `Object`\
Default: `undefined`\
Description: GeoJSON Feature. Passed to the [`path`](https://github.com/d3/d3-geo#_path) function.

## Events

Emits native events:

- mouseenter
- mouseleave
- focus
- blur
- mousedown
- mouseup
