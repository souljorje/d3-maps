# useMapObject

Provides interaction-state transitions and resolved styles for custom map SVG elements.

## Usage

:::tabs key:framework

== Vue

```vue
<script setup lang="ts">
import type {
  MapObjectEmit,
  MapObjectStyles,
} from '@d3-maps/vue'

import { useMapObject } from '@d3-maps/vue'

interface Props {
  d: string
}

defineProps<Props>()

const emit = defineEmits<MapObjectEmit>()
const styles: MapObjectStyles = {
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

const {
  computedStyle,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  onFocus,
  onBlur,
} = useMapObject(emit, styles)
</script>

<template>
  <path
    :d="d"
    :style="computedStyle"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @mousedown="onMouseDown"
    @mouseup="onMouseUp"
    @focus="onFocus"
    @blur="onBlur"
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
    hover: {
      opacity: 0.8,
    },
    active: {
      stroke: 'green',
    },
  }

  const {
    computedStyle,
    onMouseEnter,
    onMouseLeave,
    onMouseDown,
    onMouseUp,
    onClick,
    onFocus,
    onBlur,
  } = useMapObject<SVGPathElement>({
    styles,
  })

  return (
    <path
      d={d}
      style={computedStyle}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onClick={onClick}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  )
}
```

:::
