---
description: Low-level interactive SVG path or group primitive for custom D3 map layers in React and Vue
---

# MapObject

Renders a single interactive SVG element.

Use it directly when you already have a path string or when you want to take full control over how objects from `MapObjects` are rendered.

## Props

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `d?` | `string` | — | Path data for the default `path` mode |
| `tag?` | `'path' \| 'g'` | `'path'` | Render a `path` or interactive `g` |
| `styles?` | [MapObject['styles']](/api/core/mapObject#property-styles) | — | Interaction-state styles, see [styling guide](/guide/core-concepts/#styling) |

Use native SVG attrs like `fill`, `stroke`, `role`, `aria-label`, and `tabindex` / `tabIndex` directly on `MapObject`.

## Usage

:::tabs key:framework

== Vue

```vue
<template>
  <MapBase :data="mapData">
    <MapObjects #default="{ objects }">
      <MapObject
        v-for="object in objects"
        :key="object.key"
        :d="object.d"
        :fill="isFeature(object) ? 'darkorange' : 'none'"
        :styles="{
          default: { opacity: 0.9 },
          focus: { stroke: 'darkgreen' },
          hover: { opacity: 0.8 },
        }"
        role="button"
        :aria-label="isFeature(object) ? object.properties?.name : undefined"
        tabindex="0"
      />
    </MapObjects>
  </MapBase>
</template>

<script setup lang="ts">
import { isFeature } from '@d3-maps/vue'
</script>
```

== React

```tsx
import { isFeature } from '@d3-maps/react'

<MapBase data={mapData}>
  <MapObjects>
    {({ objects }) => (
      <>
        {objects.map((object) => (
          <MapObject
            key={object.key}
            d={object.d}
            fill={isFeature(object) ? 'darkorange' : 'none'}
            styles={{
              default: { opacity: 0.9 },
              focus: { stroke: 'darkgreen' },
              hover: { opacity: 0.8 },
            }}
            role="button"
            aria-label={isFeature(object) ? String(object.properties?.name ?? 'Object') : undefined}
            tabIndex={0}
          />
        ))}
      </>
    )}
  </MapObjects>
</MapBase>
```

:::

## Helpers

- See [useMapObject](/helpers/use-map-object)
