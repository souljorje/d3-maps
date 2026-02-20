## Zoom

Wrap layers with [MapZoom](/components/MapZoom) to enable pan and zoom

::: code-group

```vue{3,5} [vue]
<template>
  <Map :data="data">
    <MapZoom>
      <MapFeatures />
    </MapZoom>
  </Map>
</template>
```

:::

> Detailed zoom [usage example](/examples/zoom)