# Data

[Map](/components/map) accepts **either** TopoJSON or GeoJSON and builds a list of GeoJSON features internally

- **TopoJSON** (recommended for world/country datasets)
  - smaller payloads
  - great for client-side fetching
- **GeoJSON**
  - simpler format
  - larger payloads

## Transforming data

Use [Map](/components/map#props) `dataTransformer` prop when you need to:

- filter features (e.g. remove Antarctica)
- attach derived fields (choropleth colors, stats, custom ids)
- normalize feature properties

```vue
<Map
  :dataTransformer="(features) => features.map(/* some logic */)"
>
  <MapFeatures/>
</Map>
```

See a complete example in [Choropleth](/examples/choropleth).
