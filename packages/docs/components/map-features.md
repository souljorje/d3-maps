# MapFeatures

Renders all GeoJSON features from the current map context

## Props

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `idKey?` | `string` | `id` | Resolves feature key via `feature[idKey]`, then `feature.properties[idKey]` |
| `fill?` | `string` | — | Forwarded to [MapFeature](/components/map-feature#props) in default rendering mode |
| `stroke?` | `string` | — | Forwarded to [MapFeature](/components/map-feature#props) in default rendering mode |
| `styles?` | [MapObjectStyles](/api/core/mapObject#mapobjectstyles) | — | Forwarded to [MapFeature](/components/map-feature#props) in default rendering mode, see [styling guide](/guide/core-concepts/#styling) |

## Usage

:::tabs key:framework

== Vue

```vue
<template>
  <Map :data="mapData">
    <MapFeatures
      fill="darkorange"
      :styles="{
        default: { opacity: 0.9 },
        hover: { opacity: 0.7 },
        active: { stroke: '#1f2937', strokeWidth: 1.5 },
      }"
    />
    <MapMesh stroke="slategray" />
  </Map>
</template>
```

== React

```tsx
<Map data={mapData}>
  <MapFeatures
    fill="darkorange"
    styles={{
      default: { opacity: 0.9 },
      hover: { opacity: 0.7 },
      active: { stroke: '#1f2937', strokeWidth: 1.5 },
    }}
  />
  <MapMesh stroke="slategray" />
</Map>
```

:::

## Slots

:::tabs key:framework

== Vue

```vue
<template>
  <MapFeatures #default="{ features }">
    <MapFeature
      v-for="feature in features"
      :fill="feature.color"
      :key="feature.id"
      :data="feature"
    />
  </MapFeatures>
</template>
```

== React

```tsx
<MapFeatures>
  {({ features }) => (
    <g>
      {features.map((feature) => (
        <MapFeature
          key={String(feature.id)}
          data={feature}
          fill={String(feature.color)}
        />
      ))}
    </g>
  )}
</MapFeatures>
```

:::
