# MapFeatures

Renders multiple GeoJSON features with [MapFeature](/api/map-feature) components.

## Props

### ```idKey```

Type: `String`\
Default: `id`\
Description: Property in GeoJSON feature to use as key for `MapFeature`.

### ```fill```

Type: `String`\
Default: `lightgray`\
Description: Fill color for MapFeature

### ```stroke```

Type: `String`\
Default: `#fff`\
Description: Stroke color for MapFeature

## Slots

### Default

``` js
{
  features: GeoJSON[]
}
```
