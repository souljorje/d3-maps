# MapFeature

Renders a single GeoJSON feature as an SVG `<path>`.

## Props

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | GeoJSON Feature | — | Rendered as an SVG path |
| `styles?` | [MapObjectStyles](/api/core/mapObject#mapobjectstyles) | — | See [styling guide](/guide/core-concepts/#styling) |

Use native SVG presentation attrs like `fill` and `stroke` directly on `MapFeature`.

## Usage

:::tabs key:framework

== Vue

```vue
<template>
  <Map :data="mapData">
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
          hover: {
            opacity: 0.8,
          },
          active: {
            stroke: 'green'
          },
        }"
      />
    </MapFeatures>
  </Map>
</template>
```

== React

```tsx
<Map data={mapData}>
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
              hover: {
                opacity: 0.8,
              },
              active: {
                stroke: 'green',
              },
            }}
          />
        ))}
      </>
    )}
  </MapFeatures>
</Map>
```

:::

## Hooks

- See [useMapObject](/hooks/use-map-object)
