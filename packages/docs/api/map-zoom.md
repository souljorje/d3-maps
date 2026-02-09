# MapZoom

Provides zoom and drag for map via [d3-zoom](https://github.com/d3/d3-zoom)

## Props

### ```zoom```

Type: `Number`\
Default: `1`\
Description: Default zoom scale.\

### ```center```

Type: `Array`\
Default: `[0, 0]`\
Description: Default translation for the zoomed group as `[x, y]`.\

### ```minZoom```

Type: `Number`\
Default: `1`\
Description: Minimal zoom scale (first element in [scaleExtent](https://github.com/d3/d3-zoom#zoom_scaleExtent) method).

### ```maxZoom```

Type: `Number`\
Default: `8`\
Description: Maximum zoom scale (second element in [scaleExtent](https://github.com/d3/d3-zoom#zoom_scaleExtent) method).

### ```translateExtent```

Type: `Array`\
Default: `undefined` (`[[0, 0], [mapWidth, mapHeight]]` as computed value)\
Description: Borders where zoom is available, lean more in [d3-zoom docs](https://github.com/d3/d3-zoom#zoom_translateExtent).

### ```modifiers```

Type: `Object`\
Default: `undefined`\
Description: Object where key is d3-zoom behavior method and value is an array of arguments for that method. This is applied directly to d3-zoom behavior API.

Example:

```ts
const modifiers = {
  clickDistance: 8,
  duration: 250,
  wheelDelta: (event) => -event.deltaY * 0.001,
  scaleExtent: [[1, 8]],
}
```

Non-array values are auto-wrapped as one argument. For methods that take an array as a single argument (for example `scaleExtent`), use nested array form.

## Events

Emits [d3-zoom events](https://d3js.org/d3-zoom#zoom-events):

- zoomstart
- zoom
- zoomend

Note: Programmatic updates to `zoom` or `center` use d3-zoom `zoom.transform` and will emit zoom events.

## Advanced Control

For custom imperative behavior, use component `ref` and access:

- `zoomBehavior` (d3-zoom behavior instance)
- `container` (inner `<g>` element ref)

Then call d3-zoom behavior methods directly as needed.

## Examples

- [Zoom and drag](/examples/zoom-and-drag)
- [Bubble map](/examples/bubble-map)
