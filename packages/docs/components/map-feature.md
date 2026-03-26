# MapFeature

Renders a single GeoJSON feature as an SVG `<path>`.

## Props

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | GeoJSON Feature | — | Rendered as an SVG path |
| `styles?` | [MapObject['styles']](/api/core/mapObject#property-styles) | — | See [styling guide](/guide/core-concepts/#styling) |

Use native SVG presentation attrs like `fill` and `stroke` directly on `MapFeature`.

To use `focus` styles, make the path focusable with `tabindex="0"` / `tabIndex={0}` and add accessibility attrs like `role` and `aria-label`

## Usage

:::tabs key:framework

== Vue

```vue
<template>
  <MapBase :data="mapData">
    <MapFeatures #default="{ features }">
      <MapFeature
        v-for="feature in features"
        :key="feature.id"
        :data="feature"
        :fill="feature.color"
        :styles="{
          default: {
            opacity: 0.9,
          },
          focus: {
            stroke: 'darkgreen',
          },
          hover: {
            opacity: 0.8,
          },
          active: {
            stroke: 'green'
          },
        }"
        role="button"
        :aria-label="feature.properties?.name"
        tabindex="0"
      />
    </MapFeatures>
  </MapBase>
</template>
```

== React

```tsx
<MapBase data={mapData}>
  <MapFeatures>
    {({ features }) => (
      <>
        {features.map((feature) => (
          <MapFeature
            key={String(feature.id)}
            data={feature}
            fill={String(feature.color)}
            styles={{
              default: {
                opacity: 0.9,
              },
              focus: {
                stroke: 'darkgreen',
              },
              hover: {
                opacity: 0.8,
              },
              active: {
                stroke: 'green',
              },
            }}
            role="button"
            aria-label={String(feature.properties?.name ?? 'Country')}
            tabIndex={0}
          />
        ))}
      </>
    )}
  </MapFeatures>
</MapBase>
```

:::

## Helpers

- See [useMapObject](/helpers/use-map-object)
