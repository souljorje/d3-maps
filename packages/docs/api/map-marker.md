# MapMarker

Wrapper for markers, pins, bubbles, etc.

## Props

### ```coordinates```

Type: `Array`\
Default: `[0, 0]`\
Description: [longitude, latitude].

### ```styles```

Type: `Object`\
Default: `{}`\
Description: Object where key is a state and value is CSS (string, object, array).\

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

## Events

Emits native events:

- click
- mouseenter
- mouseleave
- mousedown
- mouseup

## Examples

- [Map with markers](/examples/markers)
- [Bubble map](/examples/bubble-map)
