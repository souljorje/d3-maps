# useMapObject

Provides interaction-state transitions and resolved styles for custom map SVG elements.

Used internally by [MapFeature](/components/map-feature), [MapLine](/components/map-line), [MapAnnotation](/components/map-annotation), [MapMarker](/components/map-marker), and [MapMesh](/components/map-mesh)

## Usage

:::tabs key:framework

== Vue

```vue
<script setup lang="ts">
import type { StyleValue } from 'vue'

import { useMapObject, type MapObjectProps } from '@d3-maps/vue'

interface Props {
  d: string
}

defineProps<Props>()

const styles: MapObjectProps<StyleValue>['styles'] = {
  default: {
    opacity: 0.9,
  },
  hover: {
    opacity: 0.8,
  },
  active: {
    stroke: 'green',
  },
}

const { style, ...events } = useMapObject(styles)
</script>

<template>
  <path
    :d="d"
    :style="style"
    v-bind="events"
  />
</template>
```

== React

```tsx
import type { CSSProperties } from 'react'

import { useMapObject, type MapObjectProps } from '@d3-maps/react'

export function CustomFeaturePath({ d }: { d: string }) {
  const styles: MapObjectProps<CSSProperties>['styles'] = {
    default: {
      opacity: 0.9,
    },
    hover: {
      opacity: 0.8,
    },
    active: {
      stroke: 'green',
    },
  }

  const { style, ...events } = useMapObject<SVGPathElement>({
    styles,
  })

  return (
    <path
      d={d}
      style={style}
      {...events}
    />
  )
}
```

:::
