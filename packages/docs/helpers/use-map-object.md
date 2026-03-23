# useMapObject

Provides interaction-state transitions and resolved styles for SVG elements  
Used internally by [MapFeature](/components/map-feature), [MapMarker](/components/map-marker), and [MapMesh](/components/map-mesh)

`focus` styles work with real DOM focus, so the target element must be focusable

## Usage

:::tabs key:framework

== Vue

```vue
<script setup lang="ts">
import type { MapObjectStyles } from '@d3-maps/vue'

import { useMapObject } from '@d3-maps/vue'

interface Props {
  d: string
}

defineProps<Props>()

const styles: MapObjectStyles = {
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
}

const { style, ...events } = useMapObject(styles)
</script>

<template>
  <path
    :d="d"
    :style="style"
    tabindex="0"
    v-bind="events"
  />
</template>
```

== React

```tsx
import type { MapObjectStyles } from '@d3-maps/react'

import { useMapObject } from '@d3-maps/react'

export function CustomFeaturePath({ d }: { d: string }) {
  const styles: MapObjectStyles = {
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
  }

  const { style, ...events } = useMapObject<SVGPathElement>({
    styles,
  })

  return (
    <path
      d={d}
      tabIndex={0}
      style={style}
      {...events}
    />
  )
}
```

:::
