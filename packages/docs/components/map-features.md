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

:::

## Slots

```vue
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
