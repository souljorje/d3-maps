# MapFeatures

Renders all GeoJSON features from the current map context

## Props

| Parameter | Type | Default value | Description |
| --- | --- | --- | --- |
| `idKey` | `string` | `id` | Resolves feature key via `feature[idKey]`, then `feature.properties[idKey]`. |
| `fill` | `string` | — | Forwarded to [MapFeature](/components/map-feature#props) in default rendering mode. |
| `stroke` | `string` | — | Forwarded to [MapFeature](/components/map-feature#props) in default rendering mode. |

## Usage

::: code-group

<<< ../.vitepress/examples/basic.vue[vue]
<<< ../.vitepress/examples/react/basic.tsx[react]

:::

## Slots

::: code-group

```vue [vue]
<MapFeatures #default="{ features }">
  <g>
    <MapFeature
      v-for="feature in features"
      :fill="feature.color"
      :key="feature.id"
      :data="feature"
    />
  </g>
</MapFeatures>
```

```tsx [react]
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
