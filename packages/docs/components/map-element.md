---
description: Low-level interactive SVG path or group primitive for custom D3 map layers in React and Vue
---

# MapElement

Renders a single interactive SVG element.

Use it directly when you already have a path string or when you want to take full control over how features from `MapFeatures` are rendered.

## Props

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `d?` | `string` | — | Path data for the default `path` mode |
| `tag?` | `'path' \| 'g'` | `'path'` | Render a `path` or interactive `g` |
| `styles?` | [InteractionProps['styles']](/api/core/interaction#property-styles) | — | Interaction-state styles, see [styling guide](/guide/core-concepts/#styling) |

Use native SVG attrs like `fill`, `stroke`, `role`, `aria-label`, and `tabindex` / `tabIndex` directly on `MapElement`.

## Usage

:::tabs key:framework

== Vue

```vue
<template>
  <MapBase>
    <MapFeatures
      :data="mapData"
      #default="{ features }"
    >
      <MapElement
        v-for="feature in features"
        :key="feature.key"
        :d="feature.d"
        fill="darkorange"
        :styles="{
          default: { opacity: 0.9 },
          focus: { stroke: 'darkgreen' },
          hover: { opacity: 0.8 },
        }"
        role="button"
        :aria-label="String(feature.properties.name ?? 'Object')"
        tabindex="0"
      />
    </MapFeatures>
  </MapBase>
</template>
```

== React

```tsx
<MapBase>
  <MapFeatures data={mapData}>
    {({ features }) =>
      features.map((feature) => (
        <MapElement
          key={feature.key}
          d={feature.d}
          fill="darkorange"
          styles={{
            default: { opacity: 0.9 },
            focus: { stroke: 'darkgreen' },
            hover: { opacity: 0.8 },
          }}
          role="button"
          aria-label={String(feature.properties.name ?? 'Object')}
          tabIndex={0}
        />
      ))
    }
  </MapFeatures>
</MapBase>
```

:::

## Helpers

- See [useInteraction](/helpers/use-interaction)
