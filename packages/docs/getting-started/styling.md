# Styling

[MapFeature](/components/map-feature) and [MapMarker](/components/map-marker) accept a `styles` prop:

```ts
const styles = {
  default: { fill: 'green' }, // default state
  hover: { fill: 'green', opacity: 0.8 }, // on hover
  active: { fill: 'darkgreen' }, // on click or focus
}
```

See an example in [Choropleth](/examples/choropleth)
