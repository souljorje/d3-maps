---
description: Interactive SVG path component for a single D3 map feature in React and Vue
---

# MapFeature

Renders one interactive map feature path

Use it with normalized feature data exposed by `MapFeatures`

## Props

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `d?` | `string` | — | SVG path data |
| `styles?` | [InteractionProps['styles']](/api/core/interaction#property-styles) | — | Interaction-state styles, see [styling guide](/guide/core-concepts/#styling) |

Use native SVG path attrs like `fill`, `stroke`, `role`, and `aria-label` directly on `MapFeature`

## Usage

:::tabs key:framework

== Vue

```vue
<MapFeatures :data="mapData" #default="{ features }">
  <MapFeature
    v-for="feature in features"
    :key="feature.key"
    :d="feature.d"
    fill="darkorange"
  />
</MapFeatures>
```

== React

```tsx
<MapFeatures data={mapData}>
  {({ features }) => features.map((feature) => (
    <MapFeature
      key={feature.key}
      d={feature.d}
      fill="darkorange"
    />
  ))}
</MapFeatures>
```

:::
